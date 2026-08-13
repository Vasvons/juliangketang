// pages/course-detail/course-detail.js
const api = require('../../services/api');
const storage = require('../../utils/storage');

Page({
  data: {
    courseId: '',
    course: {},
    chapters: [],
    pageConfigs: {},
    showLoginModal: false,
    showResourceModal: false,
    resourceText: '',
    rewardedVideoAd: null
  },

  onLoad(options) {
    const { id } = options || {};
    if (!id) {
      wx.showToast({ title: '缺少课程ID', icon: 'none' });
      return;
    }
    this.setData({ courseId: id });
    this.loadCourseDetail(id);
    this.loadPageConfigs();
    this.initRewardedVideoAd();
  },

  onShareAppMessage() {
    const { course } = this.data;
    return {
      title: course.title || '课程详情',
      path: `/pages/course-detail/course-detail?id=${this.data.courseId}`
    };
  },

  loadCourseDetail(id) {
    wx.showLoading({ title: '加载中' });
    return api.getCourseDetail(id)
      .then((res) => {
        wx.hideLoading();
        const data = res.data || res;
        const chapters = this.parseChapters(data.catalog);
        data.publish_date = this.formatDate(data.publish_date);
        this.setData({
          course: data,
          chapters
        });
        wx.setNavigationBarTitle({ title: data.title || '课程详情' });
      })
      .catch(() => {
        wx.hideLoading();
      });
  },

  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  },

  parseChapters(catalog) {
    if (!catalog) return [];
    return String(catalog)
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  },

  loadPageConfigs() {
    api.getPageConfigs()
      .then((res) => {
        const data = res.data || res;
        this.setData({ pageConfigs: data || {} });
      })
      .catch(() => {});
  },

  initRewardedVideoAd() {
    if (wx.createRewardedVideoAd) {
      try {
        const rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-test' });
        rewardedVideoAd.onLoad(() => {});
        rewardedVideoAd.onError(() => {});
        rewardedVideoAd.onClose((res) => {
          if (res && res.isEnded) {
            this.fetchResource();
          } else {
            wx.showToast({ title: '需要完整观看广告', icon: 'none' });
          }
        });
        this.setData({ rewardedVideoAd });
      } catch (e) {
        console.error('init ad error', e);
      }
    }
  },

  onHome() {
    wx.switchTab({ url: '/pages/index/index' });
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

  onActivation() {
    wx.switchTab({ url: '/pages/activation/activation' });
  },

  onGetResource() {
    const token = storage.get('TOKEN');
    if (!token) {
      this.setData({ showLoginModal: true });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '观看一段广告，即可获得此资源',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.playAd();
        }
      }
    });
  },

  playAd() {
    const { rewardedVideoAd } = this.data;
    if (!rewardedVideoAd) {
      this.mockAd();
      return;
    }
    rewardedVideoAd.load()
      .then(() => rewardedVideoAd.show())
      .catch(() => {
        this.mockAd();
      });
  },

  mockAd() {
    wx.showToast({ title: '广告播放完成（模拟）', icon: 'none' });
    setTimeout(() => {
      this.fetchResource();
    }, 1000);
  },

  fetchResource() {
    wx.showLoading({ title: '获取资源中' });
    api.getCourseResource(this.data.courseId)
      .then((res) => {
        wx.hideLoading();
        const data = res.data || res;
        this.setData({
          resourceText: data.netdisk_resource || '',
          showResourceModal: true
        });
      })
      .catch(() => {
        wx.hideLoading();
      });
  },

  onLoginClose() {
    this.setData({ showLoginModal: false });
  },

  onLoginSuccess() {
    this.setData({ showLoginModal: false });
    this.onGetResource();
  },

  onResourceClose() {
    this.setData({ showResourceModal: false });
  }
});
