const express = require('express')
const usersController = require('../controllers/usersControllers')
const router = express.Router()

// Get single user
router.route('/user/:id').get(usersController.user)

module.exports = router
