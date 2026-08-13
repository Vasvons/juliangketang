const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/info', authenticateUser, userController.getUserInfo);

module.exports = router;
