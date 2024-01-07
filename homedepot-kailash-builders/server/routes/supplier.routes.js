const express = require('express')
const router = express.Router()
const SupplierController = require('../controllers/supplier.controller')
const { verifyAccessToken,isUser } = require('../helpers/jwtHelper')

router.post('/supplier',[verifyAccessToken, isUser], SupplierController.register)
router.get('/supplier/get',[verifyAccessToken, isUser], SupplierController.get_supplier)
router.put('/supplier/delete/:id',[verifyAccessToken, isUser], SupplierController.delete_supplier)
router.put('/supplier/edit/:id',[verifyAccessToken, isUser], SupplierController.edit_supplier)

module.exports = router