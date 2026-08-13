const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateUser } = require('../middleware/auth');

router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourseById);
router.get('/:id/chapters', courseController.getCourseChapters);
router.post('/:id/resource', authenticateUser, courseController.getCourseResource);

module.exports = router;
