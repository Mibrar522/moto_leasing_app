const express = require('express');
const router = express.Router();
const appPublicController = require('../controllers/appPublicController');

router.get('/dealers', appPublicController.listDealers);
router.get('/ads', appPublicController.listAds);
router.get('/products', appPublicController.listProducts);
router.get('/vehicles', appPublicController.listAvailableVehicles);

module.exports = router;
