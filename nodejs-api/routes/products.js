const express = require('express')
const productsControllers = require('../controllers/productsControllers')
const router = express.Router()

// @route GET to get products && POST to find products
router.route('/products/').get(productsControllers.getProducts)
// @route GET to get searched products
router.route('/findProducts/').get(productsControllers.findProducts)
// @route GET to get newest products
router.route('/newProducts/').get(productsControllers.getNewProducts)
// @route GET to get single product
router.route('/product/:id').get(productsControllers.getSingleProduct)
// @route GET to get all categories
router.route('/categories/').get(productsControllers.categories)
// @route POST to add new category
router.route('/category/').post(productsControllers.addCategory)
// @route PATCH to udpate category
router.route('/category/:id').patch(productsControllers.updateCategory)
// @route DELETE to delete category
router.route('/category/:id').delete(productsControllers.deleteCategory)
// @route GET to get products from category
router.route('/category/:id').get(productsControllers.category)
// @route GET all products
router.route('/allProducts/').get(productsControllers.allProducts)
// @route to POST to add new product
router.route('/product').post(productsControllers.addProduct)
// @route PATCH to update product
router.route('/product/:id').patch(productsControllers.updateProduct)
// @route DELETE to delete product
router.route('/product/:id').delete(productsControllers.deleteProduct)
// @route GET to get all brands
router.route('/brands/').get(productsControllers.allBrands)

module.exports = router