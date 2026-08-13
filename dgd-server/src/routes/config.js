const express = require('express');
const router = express.Router();
const pageConfigController = require('../controllers/admin/pageConfigController');

router.get('/page-configs', pageConfigController.getPageConfigs);

module.exports = router;
