const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Registration routes
router.get('/register', authController.getRegisterForm);
router.post('/register', authController.register);

// Login routes
router.get('/login', authController.getLoginForm);
router.post('/login', authController.login);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;
