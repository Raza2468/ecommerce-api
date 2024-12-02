const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Adjust path

// Route to register a new user
router.post('/register', authController.register);

// Route to login a user
router.post('/login', authController.login);

module.exports = router;
