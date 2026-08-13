// pages/profile/profile.js
const storage = require('../../utils/storage');
const api = require('../../services/api');

Page({
  data: {
    isLogin: false,
    userInfo: {},
    pageConfigs: {}
  },

  onLoad() {
    this.loadPageConfigs();
  },

  onShow() {
    this.refreshUserState();
  },

  refreshUserState() {
    const token = storage.get('TOKEN');
    const cachedUser = storage.get('USER_INFO', {});
    if (token) {
      this.setData({ isLogin: true, userInfo: cachedUser });
      this.loadUserInfo();
    } else {
      this.setData({ isLogin: false, userInfo: {} });
    }
  },

  loadUserInfo() {
    api.getUserInfo()
      .then((res) => {
        const data = res.data || res;
        storage.set('USER_INFO', data);
        this.setData({ userInfo: data });
      })
      .catch(() => {});
  },

  loadPageConfigs() {
    api.getPageConfigs()
      .then((res) => {
        const data = res.data || res;
        this.setData({ pageConfigs: data || {} });
      })
      .catch(() => {});
  },

  onActivation() {
    wx.switchTab({ url: '/pages/activation/activation' });
  },

  onService() {
    const url = this.data.pageConfigs.customer_service_qrcode;
    if (!url) {
      wx.showToast({ title: '客服二维码未配置', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: `/pages/qrcode/qrcode?title=${encodeURIComponent('联系客服')}&url=${encodeURIComponent(url)}`
    });
  },

  onAbout() {
    const url = this.data.pageConfigs.about_us_qrcode;
    if (!url) {
      wx.showToast({ title: '关于我们二维码未配置', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: `/pages/qrcode/qrcode?title=${encodeURIComponent('关于我们')}&url=${encodeURIComponent(url)}`
    });
  }
});
