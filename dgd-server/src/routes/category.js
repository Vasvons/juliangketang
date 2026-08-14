const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { optionalUser } = require('../middleware/auth');

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/courses', optionalUser, categoryController.getCategoryCourses);

module.exports = router;
