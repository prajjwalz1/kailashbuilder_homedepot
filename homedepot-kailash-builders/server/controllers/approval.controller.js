const createError = require('http-errors')
const Approval = require('../models/approval.model')
const Product = require('../models/product.model')
const History = require('../models/history.model')
const  {approvalSchema} = require('../helpers/validationSchema')

module.exports = {
    register: async (req,res) =>{
        try {
            req.body["organization_id"] = res.locals.payload.organization
            const isValidated = await approvalSchema.validateAsync(req.body)
            const ApprovalReq = new Approval(isValidated)
            const newApproval = await ApprovalReq.save()
            return res.status(201).json(newApproval)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }
    },
    delete_approval: async (req,res) => {
        try {
            let deleteApproval = await Approval.updateOne( { _id: req.params.id,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": { "deleted_at": Date.now() } } )
            return res.status(201).json(deleteApproval)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }
    },
    get_Approval: async (req,res) => {
        try {
            let approvals = await Approval.find({ organization_id: res.locals.payload.organization, deleted_at:null, isApproved:false }).populate('product_id',{name:1,_id:1}).populate('warehouse_start',{name:1,_id:1}).populate('warehouse_end',{name:1,_id:1})
            return res.status(201).json(approvals)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }
    },
    approve_Approval: async (req,res) => {
        try {
            let approval = await Approval.findById(req.params.id)
            let total = 0
            let stock = 0
            let product = await Product.findById(approval.product_id,{past_history:0,created_at:0,updated_at:0})
            if(approval.type === 'update' && product){
                let warehouseFound = product.warehouses.findIndex(i=>i.warehouse.toString() ==approval.warehouse_start.toString())
                if(warehouseFound>=0){
                    product.warehouses[warehouseFound].stock_count += parseInt(approval.stock_count)
                    product.warehouses[warehouseFound].total_amount += parseInt(approval.total_price)
                }
                else {
                    let ware = {
                        warehouse:approval.warehouse_start,
                        total_amount:approval.total_price,
                        stock_count:approval.stock_count,
                        retail_price:approval.retail_price,
                        reorder_point:10
                    }
                    product.warehouses.push(ware)
                }
                let editProduct = await Product.updateOne( { _id: approval.product_id,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": product } )
                let dat = {
                    organization_id:res.locals.payload.organization,
                    warehouse: approval.warehouse_start,
                    stock_count:approval.stock_count,
                    retail_price:approval.retail_price,
                    total_amount:approval.total_price,
                    category:product.category,
                    added_on:Date.now(),
                    product_id:product._id,
                    type:"Data Added To Existing"
                }
                console.log(dat)
                const history = new History(dat)
                const newHistory = await history.save()
            }
            else if(approval.type === 'transfer' && product){
                console.log(product.warehouses)
                console.log(approval.warehouse_start)
                let findStart = product.warehouses.findIndex(f=>f.warehouse.toString() == approval.warehouse_start.toString())
                if(findStart<0){
                    return res.status(500).json({message: "Starting Warehouse has no product"})
                }
                else {
                    if(approval.stock_count>product.warehouses[findStart].stock_count && approval.total_price>product.warehouses[findStart].total_amount){
                        return res.status(500).json({message: "Stock amount more than warehouse stock's amount"})
                    }
                    else {
                        product.warehouses[findStart].stock_count -= parseInt(approval.stock_count)
                        product.warehouses[findStart].total_amount -= parseInt(approval.total_price)
                    }
                }
                let findEnd = product.warehouses.findIndex(j=>j.warehouse.toString() == approval.warehouse_end.toString())
                if(findEnd<0){
                    let ware = {
                        warehouse:approval.warehouse_end,
                        total_amount:approval.total_price,
                        stock_count:approval.stock_count,
                        retail_price:approval.retail_price,
                        reorder_point:10
                    }
                    product.warehouses.push(ware)
                }
                else {
                    product.warehouses[findEnd].stock_count += parseInt(approval.stock_count)
                    product.warehouses[findEnd].total_amount += parseInt(approval.total_price)
                }
                let dat = {
                    organization_id:res.locals.payload.organization,
                    warehouse: approval.warehouse_start,
                    stock_count:approval.stock_count,
                    retail_price:approval.retail_price,
                    total_amount:approval.total_price,
                    category:product.category,
                    added_on:Date.now(),
                    product_id:product._id,
                    type:"Transferred Data"
                }
                const history = new History(dat)
                const newHistory = await history.save()
            }
            for(let item in product.warehouses){
                total += parseInt(product.warehouses[item].total_amount)
                stock += parseInt(product.warehouses[item].stock_count)
            }
            product["total_stock"] = stock
            product["total_amount"] = total
            let editApproval = await Approval.updateOne( { _id: req.params.id,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": {isApproved:true} } )
            let editProduct = await Product.updateOne( { _id: approval.product_id,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": product } )
            return res.status(201).json(editApproval)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }
    }
}