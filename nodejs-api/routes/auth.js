const express = require('express')
const helper = require('../config/helper')
const authController = require('../controllers/authControllers')
const jwt = require('jsonwebtoken');
const router = express.Router()

// Login route
router.route('/auth/login').post([helper.hasAuthFields, helper.isPasswordAndUserMatch], authController.login)

module.exports = router