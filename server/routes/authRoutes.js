// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const uploadProfileLogo = require('../middleware/uploadProfileLogo');
const { protect, restrictTo } = require('../middleware/roleCheck');

router.post('/register', protect, restrictTo(1), authController.register);
router.post('/login', authController.login);
router.post('/switch-profile', protect, authController.switchProfile);
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);
router.post('/profile/upload-logo', protect, uploadProfileLogo.single('profileLogo'), authController.uploadProfileLogo);

module.exports = router;
