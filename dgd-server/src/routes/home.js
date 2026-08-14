const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { optionalUser } = require('../middleware/auth');

router.get('/', optionalUser, homeController.getHome);
router.get('/banner', homeController.getBanners);
router.get('/recommend', homeController.getRecommendCourses);

module.exports = router;
