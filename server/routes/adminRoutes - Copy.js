const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/roleCheck');

router.get('/dashboard', protect, adminController.getDashboardData);
router.put('/access/roles/:roleId', protect, restrictTo(1), adminController.updateRolePermissions);

module.exports = router;
