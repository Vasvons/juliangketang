// pages/course-list/course-list.js
const api = require('../../services/api');

Page({
  data: {
    categoryId: '',
    categoryName: '',
    courses: [],
    displayList: [],
    isDemo: false
  },

  // 已追加的课程总数（跨循环累计，用于广告间隔计算）
  courseCount: 0,

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
        const courses = (data && data.courses) || data || [];
        this.courseCount = 0;
        const list = this.buildDisplayList(courses);
        this.setData({
          courses: courses,
          isDemo: !!(data && data.is_demo),
          displayList: list
        });
      })
      .catch(() => {
        wx.hideLoading();
      });
  },

  buildDisplayList(courses) {
    const list = [];
    courses.forEach((course) => {
      list.push({ type: 'course', data: course });
      this.courseCount += 1;
      if (this.courseCount % 8 === 0) {
        list.push({ type: 'ad' });
      }
    });
    return list;
  },

  // 演示账号：触底后循环追加课程，广告按全局每 8 个课程间隔持续插入
  onReachBottom() {
    if (!this.data.isDemo || !this.data.courses.length) return;
    const appendList = this.buildDisplayList(this.data.courses);
    this.setData({
      displayList: this.data.displayList.concat(appendList)
    });
  }
});
