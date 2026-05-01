const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const uploadAgreement = require('../middleware/uploadAgreement');
const uploadSaleDocument = require('../middleware/uploadSaleDocument');
const { protect, restrictToFeature, requireDealerScope } = require('../middleware/roleCheck');

router.use(protect, requireDealerScope);

router.get('/', restrictToFeature('FEAT_SALES_CREATE', 'FEAT_SALES_MGMT', 'FEAT_INSTALLMENT_MGMT'), salesController.listSales);
router.post('/', restrictToFeature('FEAT_SALES_CREATE', 'FEAT_SALES_MGMT'), salesController.createSale);
router.put('/:id', restrictToFeature('FEAT_SALES_MGMT'), salesController.updateSale);
router.patch('/installments/:id/receive', restrictToFeature('FEAT_INSTALLMENT_MGMT', 'FEAT_SALES_MGMT'), salesController.receiveInstallment);
router.post('/upload-agreement', restrictToFeature('FEAT_SALES_CREATE', 'FEAT_SALES_MGMT'), uploadAgreement.single('agreement'), salesController.uploadAgreement);
router.post('/upload-document', restrictToFeature('FEAT_SALES_CREATE', 'FEAT_SALES_MGMT'), uploadSaleDocument.single('document'), salesController.uploadSaleDocument);

module.exports = router;
