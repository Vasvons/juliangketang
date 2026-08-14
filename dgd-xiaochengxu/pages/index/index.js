// pages/index/index.js
const api = require('../../services/api');

Page({
  data: {
    banners: [],
    notices: [],
    categories: [],
    recentCourses: [],
    displayList: [],
    isDemo: false,
    welcomeVisible: false,
    welcomeTitle: '',
    welcomeContent: ''
  },

  // 已追加的课程总数（跨循环累计，用于广告间隔计算）
  courseCount: 0,

  onLoad() {
    this.loadHomeData();
    this.loadWelcomePopup();
  },

  loadWelcomePopup() {
    api.getPageConfigs()
      .then((res) => {
        const data = res.data || res;
        const enabled = ['1', 'true', true].includes(data.welcome_popup_enabled);
        const content = data.welcome_popup_content || '';
        if (!enabled || !content) return;
        this.setData({
          welcomeTitle: data.welcome_popup_title || '欢迎光临',
          welcomeContent: content,
          welcomeVisible: true
        });
      })
      .catch(() => {});
  },

  onWelcomeClose() {
    this.setData({ welcomeVisible: false });
  },

  onPullDownRefresh() {
    this.loadHomeData().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadHomeData() {
    wx.showLoading({ title: '加载中' });
    return api.getHome()
      .then((res) => {
        wx.hideLoading();
        const data = res.data || res;
        this.courseCount = 0;
        const list = this.buildDisplayList(data.recentCourses || []);
        this.setData({
          banners: data.banners || [],
          notices: data.notices || [],
          categories: data.categories || [],
          recentCourses: data.recentCourses || [],
          isDemo: !!data.is_demo,
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
    if (!this.data.isDemo || !this.data.recentCourses.length) return;
    const appendList = this.buildDisplayList(this.data.recentCourses);
    this.setData({
      displayList: this.data.displayList.concat(appendList)
    });
  },

  onMore() {
    wx.switchTab({ url: '/pages/category/category' });
  }
});
