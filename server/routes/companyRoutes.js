const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { protect, restrictToFeature, requireDealerScope } = require('../middleware/roleCheck');

router.use(protect);
router.use(requireDealerScope);

router.get('/', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT', 'FEAT_PRODUCT_MGMT'), companyController.listCompanies);
router.post('/', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT'), companyController.createCompany);
router.put('/:id', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT'), companyController.updateCompany);
router.delete('/:id', restrictToFeature('FEAT_STOCK_MGMT', 'FEAT_FLEET_MGMT'), companyController.deleteCompany);

module.exports = router;
