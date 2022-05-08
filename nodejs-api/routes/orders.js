const express = require('express')
const ordersController = require('../controllers/ordersControllers')
const router = express.Router()

//@route GET to get all orders
router.route('/allOrders/').get(ordersController.getAllOrders)
//@route to GET single order
router.route('/order/:id').get(ordersController.getSingleOrder)
//@route to create new order
router.route('/order/new').post(ordersController.newOrder)
//@route to fake payment
router.route('/payment/').post(ordersController.payment)

module.exports = router
