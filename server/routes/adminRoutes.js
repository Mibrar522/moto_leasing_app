const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adsController = require('../controllers/adsController');
const adminCustomerOrdersController = require('../controllers/adminCustomerOrdersController');
const { protect, restrictTo, restrictToFeature, requireDealerScope } = require('../middleware/roleCheck');
const uploadAdImage = require('../middleware/uploadAdImage');

router.get('/dashboard', protect, requireDealerScope, restrictToFeature('FEAT_DASHBOARD_VIEW'), adminController.getDashboardData);
router.put('/access/roles/:roleId', protect, restrictToFeature('FEAT_ACCESS_CONTROL'), adminController.updateRolePermissions);
router.post('/notifications/read', protect, restrictToFeature('FEAT_DASHBOARD_VIEW'), adminController.markNotificationsRead);
router.get('/ads', protect, requireDealerScope, restrictToFeature('FEAT_ADS_MGMT'), adsController.listAds);
router.post('/ads', protect, requireDealerScope, restrictToFeature('FEAT_ADS_MGMT'), adsController.createAd);
router.put('/ads/:id', protect, requireDealerScope, restrictToFeature('FEAT_ADS_MGMT'), adsController.updateAd);
router.delete('/ads/:id', protect, requireDealerScope, restrictToFeature('FEAT_ADS_MGMT'), adsController.deleteAd);
router.post('/ads/upload-image', protect, requireDealerScope, restrictToFeature('FEAT_ADS_MGMT'), uploadAdImage.single('adImage'), adsController.uploadAdImage);

// Customer app installment receipt (admin/staff only)
router.post(
    '/customer-orders/:id/installments/:installmentNumber/receive',
    protect,
    requireDealerScope,
    restrictToFeature('FEAT_INSTALLMENT_MGMT', 'FEAT_SALES_MGMT'),
    adminCustomerOrdersController.receiveCustomerOrderInstallment
);

module.exports = router;
