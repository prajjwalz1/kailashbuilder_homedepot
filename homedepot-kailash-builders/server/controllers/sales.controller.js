const createError = require('http-errors')
const Sales = require('../models/sales.model')
const {salesSchema} = require('../helpers/validationSchema')
const Product = require('../models/product.model')
const User = require('../models/user.model')
const Machine = require('../models/machines.model')
const History = require('../models/history.model')
const Group = require('../models/groups.model')
const Supplier = require('../models/supplier.model')

const moment = require('moment')


module.exports = {
    register: async (req,res) =>{
        try {
            req.body["organization_id"] = res.locals.payload.organization
            console.log(req.body)
            if(req.body.invoice_date == "" || !req.body.invoice_date){
                req.body.invoice_date = Date.now()
            }
            if(req.body.items){
                for(let sale in req.body.items){
                    if(req.body.items[sale].onModel === 'product'){
                        let total = 0
                        let stock = 0
                        let product = await Product.findById(req.body.items[sale].item.value,{past_history:0,created_at:0,updated_at:0})
                        let warehouseFound = product.warehouses.findIndex(i=>i.warehouse.toString() == req.body.items[sale].warehouse.value.toString())
                        if(warehouseFound>=0){
                            if(product.warehouses[warehouseFound].stock_count >= req.body.items[sale].quantity){
                                product.warehouses[warehouseFound].stock_count -= parseInt(req.body.items[sale].quantity)
                                product.warehouses[warehouseFound].total_amount -= parseInt(req.body.items[sale].total)
                                if(product.warehouses[warehouseFound].total_amount<0){
                                    product.warehouses[warehouseFound].total_amount = 0
                                }
                            }
                            else {
                                return res.status(500).json({message:"Stock Count Higher than available"})
                            }
                            for(let item in product.warehouses){
                                total += parseInt(product.warehouses[item].total_amount)
                                stock += parseInt(product.warehouses[item].stock_count)
                            }
                            product["total_stock"] = stock
                            product["total_amount"] = total
                            let editProduct = await Product.updateOne( { _id: req.body.items[sale].item.value,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": product } )
                            let dat = {
                                organization_id:res.locals.payload.organization,
                                warehouse: req.body.items[sale].warehouse.value,
                                stock_count:req.body.items[sale].quantity,
                                retail_price:req.body.items[sale].retail_price,
                                total_amount:req.body.items[sale].total,
                                product_id:product._id,
                                category:product.category,
                                added_on:Date.now(),
                                type:"Sales Details"
                            }
                            const history = new History(dat)
                            const newHistory = await history.save()
                        }else {
                            return res.status(500).json({message:"Item Not Found in Warehouse"})
                        }
                    }
                    else if(req.body.items[sale].onModel === 'staffs'){
                        let staffs = await User.findById(req.body.items[sale].item.value,{password:0,created_at:0,updated_at:0})
                        if(!staffs['total_spent']){
                            staffs['total_spent'] = 0
                        }
                        staffs['total_spent'] += parseInt(req.body.items[sale].total)
                        console.log(staffs)
                        let date = null
                        if(!staffs.salary_start_date){
                            date = Date.now()
                        }
                        else {
                            date = staffs.salary_start_date
                        }
                        let startDate = moment(staffs.salary_start_date)
                        let mainStartDate = startDate.add(parseInt(req.body.items[sale].quantity), 'M').format("YYYY-MM-DD")
                        staffs["salary_start_date"] = mainStartDate
                        staffs["next_salary_date"] = moment(mainStartDate).add(1,'M').format("YYYY-MM-DD")
                        let editStaff = await User.updateOne( { _id: staffs._id,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": staffs } )
                    }
                    else if(req.body.items[sale].onModel === 'machine'){
                        let machine = await Machine.findById(req.body.items[sale].item.value)
                        machine['amount_spent'] += parseInt(req.body.items[sale].total)
                        machine['time_spent'] += parseInt(req.body.items[sale].quantity)
                        let editMachine = await Machine.updateOne( { _id: machine._id,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": machine } )
                    }
                    else if(req.body.items[sale].onModel === 'group'){
                        let group = await Group.findById(req.body.items[sale].item.value)
                        group['total_spent'] += parseInt(req.body.items[sale].total)
                        let pushData = {
                            amount:req.body.items[sale].total,
                            added_by:res.locals.payload.id
                        }
                        group['paid_history'].push(pushData)
                        let editgroup = await Group.updateOne( { _id: group._id,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": group } )
                    }
                    else if(req.body.items[sale].onModel === 'supplier'){
                        let supplier = await Supplier.findById(req.body.items[sale].item.value)
                        supplier['total_spent'] += parseInt(req.body.items[sale].total)
                        let pushData = {
                            amount:req.body.items[sale].total,
                            added_by:res.locals.payload.id
                        }
                        supplier['paid_history'].push(pushData)
                        let editgroup = await Supplier.updateOne( { _id: supplier._id,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": supplier } )
                    }
                }
            }
            const isValidated = await salesSchema.validateAsync(req.body)
            const sale = new Sales(isValidated)
            const newSales = await sale.save()
            return res.status(201).json(newSales)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }
    },
    get_sales: async (req,res) => {
        try{
            let totalItem = await Sales.countDocuments({organization_id:{$eq:res.locals.payload.organization},deleted_at:null})
            if(totalItem <=0){
                return res.status(201).json({
                    data:[],
                    currentPage:1,
                    totalPage:1
                })
            }
            let perPage = 12
            let skip = perPage * parseInt(req.params.page)
            let totalPage = totalItem/perPage
            let page = totalPage % perPage === 0 ? parseInt(totalPage) : parseInt(totalPage + 1)
            if(parseInt(req.params.page) >= parseInt(page)){
                return res.status(400).json({message: "Invalid Page"})
            }
            let sales = await Sales.find({organization_id:{$eq:res.locals.payload.organization},deleted_at:null}).populate('client').skip(skip).limit(perPage)
            return res.status(201).json({
                data:sales,
                currentPage:parseInt(req.params.page)+1,
                totalPage:parseInt(page)
            })
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }
    },
    get_sales_by_id: async (req,res) => {
        try{
            let totalItem = await Sales.countDocuments({organization_id:{$eq:res.locals.payload.organization},deleted_at:null})
            if(totalItem <=0){
                return res.status(201).json({
                    data:[],
                    currentPage:1,
                    totalPage:1
                })
            }
            let perPage = 12
            let skip = perPage * parseInt(req.params.page)
            let totalPage = totalItem/perPage
            let page = totalPage % perPage === 0 ? parseInt(totalPage) : parseInt(totalPage + 1)
            if(parseInt(req.params.page) >= parseInt(page)){
                return res.status(400).json({message: "Invalid Page"})
            }
            let products = await Sales.find({organization_id:{$eq:res.locals.payload.organization},deleted_at:null}).sort({invoice_date:-1}).skip(skip).limit(perPage)
            return res.status(201).json({
                data:products,
                currentPage:parseInt(req.params.page)+1,
                totalPage:parseInt(page)
            })
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }
    },
    search_sales: async (req,res) => {
        try {
            let query = req.params.query.toString()
            let sales = await Sales.find({ organization_id:{$eq:res.locals.payload.organization},deleted_at:null, "invoice_no": { "$regex": query, "$options": "i" } }).limit(12)
            return res.status(201).json({
                data:sales,
                currentPage:1,
                totalPage:1
            })
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }
    },
    edit_sales: async (req,res) => {
        try {
            req.body["organization_id"] = res.locals.payload.organization
            let totalAmt = 0
            for(let item in req.body.items){
                totalAmt += req.body.items[item].total
            }
            req.body["isPaid"] = req.body.amount_paid >= totalAmt;
            let editSales = await Sales.updateOne( { _id: req.params.id,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": req.body } )
            return res.status(201).json(editSales)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }
    },
    delete_sales: async (req,res) => {
        try {
            let deleteSales = await Sales.updateOne( { _id: req.params.id,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": { "deleted_at": Date.now() } } )
            return res.status(201).json(deleteSales)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }

    }
}