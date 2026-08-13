const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const homeRoutes = require('./home');
const categoryRoutes = require('./category');
const courseRoutes = require('./course');
const activationRoutes = require('./activation');
const adminRoutes = require('./admin');
const uploadRoutes = require('./upload');
const configRoutes = require('./config');
const userRoutes = require('./user');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/home', homeRoutes);
router.use('/categories', categoryRoutes);
router.use('/courses', courseRoutes);
router.use('/activation', activationRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/config', configRoutes);

module.exports = router;
