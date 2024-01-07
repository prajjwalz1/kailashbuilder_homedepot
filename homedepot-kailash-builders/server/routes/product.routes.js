const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/product.controller')
const { verifyAccessToken,isUser } = require('../helpers/jwtHelper')

router.post('/product',[verifyAccessToken, isUser], ProductController.register)
router.get('/product/:page',[verifyAccessToken, isUser], ProductController.get_product)
router.get('/product/history/:id/:page',[verifyAccessToken, isUser], ProductController.get_product_history)
router.get('/product/sales/:page',[verifyAccessToken, isUser], ProductController.get_product_for_sales)
router.get('/product/get/:id',[verifyAccessToken, isUser], ProductController.get_products_by_id)
router.delete('/product/delete/:id',[verifyAccessToken, isUser], ProductController.delete_product)
router.put('/product/edit/:id',[verifyAccessToken, isUser], ProductController.edit_product)
router.get('/product/search/:query',[verifyAccessToken, isUser], ProductController.search_products)
router.get('/product/search/sales/:query',[verifyAccessToken, isUser], ProductController.search_products_for_sales)


module.exports = router