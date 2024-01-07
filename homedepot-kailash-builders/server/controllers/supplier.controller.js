const createError = require('http-errors')
const Supplier = require('../models/supplier.model')
const  {supplierSchema} = require('../helpers/validationSchema')


module.exports = {
    register: async (req,res) =>{
        try {
            console.log(req.body)
            req.body["organization_id"] = res.locals.payload.organization
            const isValidated = await supplierSchema.validateAsync(req.body)
            const doesExists = await Supplier.findOne({ name: req.body.name, organization_id: res.locals.payload.organization, deleted_at:null })
            if (doesExists) throw createError.Conflict(`${req.body.name} is already Used`)
            const supplier = new Supplier(isValidated)
            const newSupplier = await supplier.save()
            return res.status(201).json(newSupplier)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }
    },
    get_supplier: async (req,res) => {
        try {
            let supplier = await Supplier.find({ organization_id: res.locals.payload.organization,deleted_at:null }).populate('paid_history.added_by',{full_name:1,_id:1})
            return res.status(201).json(supplier)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }
    },
    edit_supplier: async (req,res) => {
        try {
            req.body["organization_id"] = res.locals.payload.organization
            let deleteSupplier = await Supplier.updateOne( { _id: req.params.id,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": req.body } )
            return res.status(201).json(deleteSupplier)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }
    },
    delete_supplier: async (req,res) => {
        try {
            let deleteSupplier = await Supplier.updateOne( { _id: req.params.id,organization_id:res.locals.payload.organization,deleted_at:null },{ "$set": { "deleted_at": Date.now() } } )
            return res.status(201).json(deleteSupplier)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            return res.status(400).json({message: error.message})
        }

    }
}