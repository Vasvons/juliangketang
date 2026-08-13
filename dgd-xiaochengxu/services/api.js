// services/api.js
const http = require('../utils/request');

const api = {
  // 登录
  login(code, userInfo) {
    return http.post('/auth/login', { code, userInfo });
  },

  // 首页
  getHome() {
    return http.get('/home');
  },

  // 分类
  getCategories() {
    return http.get('/categories');
  },

  getCategoryCourses(id) {
    return http.get(`/categories/${id}/courses`);
  },

  // 课程
  getCourseDetail(id) {
    return http.get(`/courses/${id}`);
  },

  getCourseResource(id) {
    return http.post(`/courses/${id}/resource`);
  },

  // 卡密激活
  activateCode(code) {
    return http.post('/activation/activate', { code });
  },

  // 页面配置
  getPageConfigs() {
    return http.get('/config/page-configs');
  },

  // 用户信息
  getUserInfo() {
    return http.get('/user/info');
  }
};

module.exports = api;
