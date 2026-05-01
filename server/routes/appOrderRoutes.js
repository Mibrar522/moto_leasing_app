const express = require('express');
const router = express.Router();
const appOrderController = require('../controllers/appOrderController');
const { protectCustomer } = require('../middleware/customerProtect');

router.use(protectCustomer);

router.get('/', appOrderController.listOrders);
router.post('/', appOrderController.createOrder);
router.get('/:id', appOrderController.getOrder);

module.exports = router;
