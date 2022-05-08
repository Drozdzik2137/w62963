const express = require('express')
const productsControllers = require('../controllers/productsControllers')
const router = express.Router()

// @route GET to get products && POST to find products
router.route('/products/').get(productsControllers.getProducts).post(productsControllers.findProducts)
// @route GET to get newest products
router.route('/newProducts/').get(productsControllers.getNewProducts)
// @route GET to get single product
router.route('/product/:id').get(productsControllers.getSingleProduct)
// @route GET to get all categories
router.route('/categories/').get(productsControllers.categories)
// @route GET to get products from category
router.route('/category/:category').get(productsControllers.category)

module.exports = router