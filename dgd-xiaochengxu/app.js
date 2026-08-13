// app.js
const storage = require('./utils/storage');

App({
  onLaunch() {
    console.log('小程序启动');
    const token = storage.get('TOKEN');
    if (token) {
      console.log('用户已登录');
    }
  },

  onShow() {
    // 小程序切前台
  },

  onHide() {
    // 小程序切后台
  },

  globalData: {
    apiBaseUrl: 'http://localhost:3000/api',
    userInfo: null,
    token: ''
  }
});
