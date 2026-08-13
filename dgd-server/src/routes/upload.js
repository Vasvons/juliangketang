const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

router.post('/avatar', uploadController.uploadMiddleware, uploadController.uploadImage);
router.post('/image', uploadController.uploadMiddleware, uploadController.uploadImage);

module.exports = router;
