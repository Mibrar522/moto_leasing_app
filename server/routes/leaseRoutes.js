const express = require('express');
const router = express.Router();
const leaseController = require('../controllers/leaseController');
const { protect, requireDealerScope } = require('../middleware/roleCheck');

// Endpoint: POST /api/v1/leases/submit
router.post('/submit', protect, requireDealerScope, leaseController.submitLease);

module.exports = router;
