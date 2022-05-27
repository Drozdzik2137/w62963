const express = require('express')
const ordersController = require('../controllers/ordersControllers')
const router = express.Router()

//@route GET to get all orders
router.route('/allOrders/').get(ordersController.getAllOrders)
//@route to GET single order
router.route('/order/:id').get(ordersController.getSingleOrder)
//@route to change order status
router.route('/order/:id').patch(ordersController.changeOrderStatus)
//@route to create new order
router.route('/order/new').post(ordersController.newOrder)
//@route to fake payment
router.route('/order/payment/').post(ordersController.payment)
//@route to get all orders by user
router.route('/order/user/:id').get(ordersController.getUserOrders)
//@route to get total price for order
router.route('/orderTotal/:id').get(ordersController.getSingleOrderTotal)

module.exports = router
