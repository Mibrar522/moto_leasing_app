const express = require('express');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

router.get('/:id/:fileName?', uploadController.getUploadedFile);

module.exports = router;
