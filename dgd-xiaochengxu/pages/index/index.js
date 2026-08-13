// pages/index/index.js
const api = require('../../services/api');

Page({
  data: {
    banners: [],
    notices: [],
    categories: [],
    recentCourses: [],
    displayList: [],
    welcomeVisible: false,
    welcomeTitle: '',
    welcomeContent: ''
  },

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
        const list = this.buildDisplayList(data.recentCourses || []);
        this.setData({
          banners: data.banners || [],
          notices: data.notices || [],
          categories: data.categories || [],
          recentCourses: data.recentCourses || [],
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
  },

  onMore() {
    wx.switchTab({ url: '/pages/category/category' });
  }
});
