const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.getHome);
router.get('/banner', homeController.getBanners);
router.get('/recommend', homeController.getRecommendCourses);

module.exports = router;
