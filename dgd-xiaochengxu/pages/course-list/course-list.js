// pages/course-list/course-list.js
const api = require('../../services/api');

Page({
  data: {
    categoryId: '',
    categoryName: '',
    courses: [],
    displayList: []
  },

  onLoad(options) {
    const { id, name } = options || {};
    const decodedName = name ? decodeURIComponent(name) : '';
    this.setData({
      categoryId: id,
      categoryName: decodedName || '课程列表'
    });
    if (id) {
      this.loadCourses(id);
    }
    wx.setNavigationBarTitle({ title: decodedName || '课程列表' });
  },

  onPullDownRefresh() {
    if (this.data.categoryId) {
      this.loadCourses(this.data.categoryId).finally(() => {
        wx.stopPullDownRefresh();
      });
    } else {
      wx.stopPullDownRefresh();
    }
  },

  loadCourses(id) {
    wx.showLoading({ title: '加载中' });
    return api.getCategoryCourses(id)
      .then((res) => {
        wx.hideLoading();
        const data = res.data || res;
        const list = this.buildDisplayList(data || []);
        this.setData({
          courses: data || [],
          displayList: list
        });
      })
      .catch(() => {
        wx.hideLoading();
      });
  },

  buildDisplayList(courses) {
    const list = [];
    courses.forEach((course, index) => {
      list.push({ type: 'course', data: course });
      if ((index + 1) % 8 === 0) {
        list.push({ type: 'ad' });
      }
    });
    return list;
  }
});
