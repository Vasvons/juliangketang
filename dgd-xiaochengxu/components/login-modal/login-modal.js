// components/login-modal/login-modal.js
const api = require('../../services/api');
const storage = require('../../utils/storage');

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    },

    onCancel() {
      this.triggerEvent('close');
    },

    onLogin() {
      wx.showLoading({ title: '登录中' });
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (profileRes) => {
          wx.login({
            success: (loginRes) => {
              if (loginRes.code) {
                this.doLogin(loginRes.code, profileRes.userInfo);
              } else {
                wx.hideLoading();
                wx.showToast({ title: '登录失败', icon: 'none' });
              }
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: '登录失败', icon: 'none' });
            }
          });
        },
        fail: () => {
          wx.login({
            success: (loginRes) => {
              if (loginRes.code) {
                this.doLogin(loginRes.code, null);
              } else {
                wx.hideLoading();
                wx.showToast({ title: '登录失败', icon: 'none' });
              }
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: '登录失败', icon: 'none' });
            }
          });
        }
      });
    },

    doLogin(code, userInfo) {
      api.login(code, userInfo)
        .then((res) => {
          wx.hideLoading();
          const data = res.data || res;
          if (data && data.token) {
            storage.set('TOKEN', data.token);
            storage.set('USER_INFO', data.user || {});
            this.triggerEvent('success', { user: data.user });
            this.triggerEvent('close');
            wx.showToast({ title: '登录成功', icon: 'success' });
          } else {
            wx.showToast({ title: '登录失败', icon: 'none' });
          }
        })
        .catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '登录失败', icon: 'none' });
        });
    }
  }
});
