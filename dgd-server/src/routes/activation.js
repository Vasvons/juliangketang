const express = require('express');
const router = express.Router();
const activationController = require('../controllers/activationController');
const { authenticateUser } = require('../middleware/auth');

router.post('/activate', authenticateUser, activationController.activateCode);

module.exports = router;
