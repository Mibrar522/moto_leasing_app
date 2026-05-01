const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploadProductImage = require('../middleware/uploadProductImage');
const { protect, restrictToFeature } = require('../middleware/roleCheck');

router.use(protect);

router.get('/', restrictToFeature('FEAT_PRODUCT_MGMT', 'FEAT_FLEET_MGMT'), productController.listProducts);
router.get('/vehicle-types', restrictToFeature('FEAT_PRODUCT_MGMT', 'FEAT_FLEET_MGMT', 'FEAT_STOCK_MGMT', 'FEAT_SALES_CREATE', 'FEAT_SALES_MGMT'), productController.listVehicleTypes);
router.post('/vehicle-types', restrictToFeature('FEAT_PRODUCT_MGMT', 'FEAT_FLEET_MGMT'), productController.createVehicleType);
router.post('/upload-image', restrictToFeature('FEAT_PRODUCT_MGMT', 'FEAT_FLEET_MGMT'), uploadProductImage.single('productImage'), productController.uploadProductImage);
router.post('/', restrictToFeature('FEAT_PRODUCT_MGMT', 'FEAT_FLEET_MGMT'), productController.createProduct);
router.put('/:id', restrictToFeature('FEAT_PRODUCT_MGMT', 'FEAT_FLEET_MGMT'), productController.updateProduct);

module.exports = router;
