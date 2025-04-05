const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware); // Apply authentication to all user routes

router.get('/', usersController.getAllUsers); // Admin-only
router.get('/profile', usersController.getUserProfile);

module.exports = router;
