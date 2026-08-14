const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const bannerController = require('../controllers/admin/bannerController');
const noticeController = require('../controllers/admin/noticeController');
const categoryController = require('../controllers/admin/categoryController');
const courseController = require('../controllers/admin/courseController');
const levelController = require('../controllers/admin/levelController');
const activationCodeController = require('../controllers/admin/activationCodeController');
const pageConfigController = require('../controllers/admin/pageConfigController');
const uploadController = require('../controllers/admin/uploadController');

// 认证
router.post('/auth/login', adminController.login);

// 仪表盘与用户
router.get('/dashboard', authenticateAdmin, adminController.getDashboard);
router.get('/users', authenticateAdmin, adminController.getUsers);
router.put('/users/:id/level', authenticateAdmin, adminController.updateUserLevel);
router.put('/users/:id/demo', authenticateAdmin, adminController.updateUserDemo);

// Banner 管理
router.get('/banners', authenticateAdmin, bannerController.getBanners);
router.post('/banners', authenticateAdmin, bannerController.createBanner);
router.put('/banners/:id', authenticateAdmin, bannerController.updateBanner);
router.delete('/banners/:id', authenticateAdmin, bannerController.deleteBanner);
router.put(
  '/banners/:id/status',
  authenticateAdmin,
  bannerController.updateBannerStatus
);

// 通知管理
router.get('/notices', authenticateAdmin, noticeController.getNotices);
router.post('/notices', authenticateAdmin, noticeController.createNotice);
router.put('/notices/:id', authenticateAdmin, noticeController.updateNotice);
router.delete('/notices/:id', authenticateAdmin, noticeController.deleteNotice);
router.put(
  '/notices/:id/status',
  authenticateAdmin,
  noticeController.updateNoticeStatus
);

// 分类管理
router.get('/categories', authenticateAdmin, categoryController.getCategories);
router.post('/categories', authenticateAdmin, categoryController.createCategory);
router.put(
  '/categories/:id',
  authenticateAdmin,
  categoryController.updateCategory
);
router.delete(
  '/categories/:id',
  authenticateAdmin,
  categoryController.deleteCategory
);
router.put(
  '/categories/:id/status',
  authenticateAdmin,
  categoryController.updateCategoryStatus
);

// 课程资源管理
router.get('/courses', authenticateAdmin, courseController.getCourses);
router.post('/courses', authenticateAdmin, courseController.createCourse);
router.put('/courses/:id', authenticateAdmin, courseController.updateCourse);
router.delete('/courses/:id', authenticateAdmin, courseController.deleteCourse);
router.put(
  '/courses/:id/status',
  authenticateAdmin,
  courseController.updateCourseStatus
);

// 用户等级管理
router.get('/levels', authenticateAdmin, levelController.getLevels);
router.post('/levels', authenticateAdmin, levelController.createLevel);
router.put('/levels/:id', authenticateAdmin, levelController.updateLevel);
router.delete('/levels/:id', authenticateAdmin, levelController.deleteLevel);

// 卡密管理
router.get(
  '/activation-codes',
  authenticateAdmin,
  activationCodeController.getActivationCodes
);
router.post(
  '/activation-codes/generate',
  authenticateAdmin,
  activationCodeController.generateActivationCodes
);
router.delete(
  '/activation-codes/:id',
  authenticateAdmin,
  activationCodeController.deleteActivationCode
);

// 页面配置管理
router.get(
  '/page-configs',
  authenticateAdmin,
  pageConfigController.getPageConfigs
);
router.put(
  '/page-configs',
  authenticateAdmin,
  pageConfigController.updatePageConfigs
);

// 文件上传
router.post(
  '/upload',
  authenticateAdmin,
  uploadController.uploadMiddleware,
  uploadController.uploadImage
);

module.exports = router;
