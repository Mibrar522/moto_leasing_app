const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const uploadBankSlip = require('../middleware/uploadBankSlip');
const { protect, restrictToFeature, requireDealerScope } = require('../middleware/roleCheck');

router.use(protect, requireDealerScope);

router.get('/orders', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT'), stockController.listStockOrders);
router.post('/orders', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT'), stockController.createStockOrder);
router.post('/orders/:id/resend-email', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT'), stockController.resendStockOrderEmail);
router.post('/orders/:id/receive', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT', 'FEAT_STOCK_RECEIVE', 'FEAT_STOCK_RECEIVED_UPDATE'), stockController.receiveStockOrder);
router.post('/orders/:id/payment', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT', 'FEAT_STOCK_UPDATE', 'FEAT_STOCK_RECEIVED_UPDATE'), stockController.recordStockPayment);
router.patch('/orders/:id', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT', 'FEAT_STOCK_UPDATE', 'FEAT_STOCK_RECEIVE', 'FEAT_STOCK_RECEIVED_UPDATE'), stockController.updateStockOrder);
router.delete('/orders/:id', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT', 'FEAT_STOCK_DELETE', 'FEAT_STOCK_RECEIVED_DELETE'), stockController.deleteStockOrder);
router.post('/upload-slip', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT'), uploadBankSlip.single('bankSlip'), stockController.uploadBankSlip);

module.exports = router;
