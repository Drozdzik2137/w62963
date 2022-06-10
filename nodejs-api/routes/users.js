const express = require('express')
const usersController = require('../controllers/usersControllers')
const router = express.Router()

// Get single user
router.route('/user/:id').get(usersController.user)
// Update user data
router.route('/user/:id').patch(usersController.updateUserData)
// Delete user
router.route('/user/:id').delete(usersController.deleteUser)
// Get all useres
router.route('/allUsers').get(usersController.getAllUsers)

module.exports = router
