const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const uploadBankSlip = require('../middleware/uploadBankSlip');
const { protect, restrictToFeature, requireDealerScope } = require('../middleware/roleCheck');

router.use(protect, requireDealerScope);

router.get('/orders', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT'), stockController.listStockOrders);
router.post('/orders', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT'), stockController.createStockOrder);
router.patch('/orders/:id', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT'), stockController.updateStockOrder);
router.post('/upload-slip', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT'), uploadBankSlip.single('bankSlip'), stockController.uploadBankSlip);

module.exports = router;
