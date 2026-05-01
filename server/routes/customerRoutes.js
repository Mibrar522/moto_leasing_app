const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const uploadCustomerAsset = require('../middleware/uploadCustomerAsset');
const { protect, restrictToFeature, requireDealerScope } = require('../middleware/roleCheck');

router.use(protect, requireDealerScope);

router.get('/', restrictToFeature('FEAT_CUSTOMER_REGISTER', 'FEAT_CUSTOMER_RECORD_VIEW', 'FEAT_CUSTOMER_MGMT', 'FEAT_OCR_SCAN', 'FEAT_BIOMETRIC', 'FEAT_CUSTOMER_BIOMETRIC'), customerController.listCustomers);
router.get('/:id', restrictToFeature('FEAT_CUSTOMER_RECORD_VIEW', 'FEAT_CUSTOMER_REGISTER', 'FEAT_CUSTOMER_MGMT', 'FEAT_OCR_SCAN', 'FEAT_BIOMETRIC', 'FEAT_CUSTOMER_BIOMETRIC'), customerController.getCustomerById);
router.post('/upload-asset', restrictToFeature('FEAT_CUSTOMER_MGMT', 'FEAT_OCR_SCAN', 'FEAT_BIOMETRIC', 'FEAT_CUSTOMER_BIOMETRIC'), uploadCustomerAsset.single('customerAsset'), customerController.uploadCustomerAsset);
router.post('/', restrictToFeature('FEAT_CUSTOMER_MGMT'), customerController.createCustomer);
router.put('/:id', restrictToFeature('FEAT_CUSTOMER_RECORD_EDIT', 'FEAT_CUSTOMER_MGMT'), customerController.updateCustomer);
router.delete('/:id', restrictToFeature('FEAT_CUSTOMER_RECORD_DELETE', 'FEAT_CUSTOMER_MGMT'), customerController.deleteCustomer);

module.exports = router;
