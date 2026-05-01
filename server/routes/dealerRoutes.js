const express = require('express');
const dealerController = require('../controllers/dealerController');
const uploadDealerLogo = require('../middleware/uploadDealerLogo');
const { protect, restrictTo, restrictToFeature } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect, restrictTo(1), restrictToFeature('FEAT_DEALER_MGMT'));

router.get('/', dealerController.listDealers);
router.post('/upload-logo', uploadDealerLogo.single('dealerLogo'), dealerController.uploadDealerLogo);
router.post('/upload-signature', uploadDealerLogo.single('dealerSignature'), dealerController.uploadDealerSignature);
router.post('/', dealerController.createDealer);
router.put('/:id', dealerController.updateDealer);
router.delete('/:id', dealerController.deleteDealer);

module.exports = router;
