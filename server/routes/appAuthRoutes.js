const express = require('express');
const router = express.Router();
const appAuthController = require('../controllers/appAuthController');
const { protectCustomer } = require('../middleware/customerProtect');

router.post('/request-otp', appAuthController.requestOtp);
router.post('/verify-otp', appAuthController.verifyOtp);
router.get('/me', protectCustomer, appAuthController.me);

module.exports = router;

