// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, verifyOtp, login, logout } = require('../controllers/authController'); // Add logout here

// Define your routes
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/logout', logout); // Add logout route here

module.exports = router;
