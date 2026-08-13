// pages/activation/activation.js
const api = require('../../services/api');
const storage = require('../../utils/storage');

Page({
  data: {
    isLogin: false,
    userInfo: {},
    pageConfigs: {},
    showLoginModal: false,
    showActivationModal: false,
    defaultIntro: '<p style="color:#333;line-height:1.8;">聚量学堂，<strong style="color:#ff3333;">每天有新的学习资料</strong>。你再也不用花几百去报名学习，<strong style="color:#0066ff;">不用担心被骗，学不到东西</strong>。</p><p style="color:#333;line-height:1.8;margin-top:16rpx;">资源在<strong style="color:#ff3333;">百度网盘</strong>上，小程序不能在线看。每个课程都有<strong style="color:#0066ff;">单独网盘分享链接</strong>。通过链接把资源<strong style="color:#ff3333;">保存到你的网盘上进行学习</strong>。</p>'
  },

  onLoad() {
    this.loadPageConfigs();
    this.refreshUserState();
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

  onActivateTap() {
    if (!this.data.isLogin) {
      this.setData({ showLoginModal: true });
      return;
    }
    this.setData({ showActivationModal: true });
  },

  onLoginClose() {
    this.setData({ showLoginModal: false });
  },

  onLoginSuccess(e) {
    const user = e.detail && e.detail.user ? e.detail.user : {};
    this.setData({
      showLoginModal: false,
      isLogin: true,
      userInfo: user
    });
    this.setData({ showActivationModal: true });
  },

  onActivationClose() {
    this.setData({ showActivationModal: false });
  },

  onActivationConfirm(e) {
    const { code } = e.detail;
    wx.showLoading({ title: '激活中' });
    api.activateCode(code)
      .then((res) => {
        wx.hideLoading();
        const data = res.data || res;
        this.setData({ showActivationModal: false });
        wx.showToast({ title: `激活成功：${data.level_name || ''}`, icon: 'none' });
        this.refreshUserState();
      })
      .catch(() => {
        wx.hideLoading();
      });
  }
});
