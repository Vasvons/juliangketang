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

  data: {
    tempAvatar: '',
    tempNickname: '',
    submitting: false
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    },

    onCancel() {
      this.triggerEvent('close');
    },

    onNoop() {},

    onChooseAvatar(e) {
      const { avatarUrl } = e.detail || {};
      if (avatarUrl) {
        this.setData({ tempAvatar: avatarUrl });
      }
    },

    onNicknameInput(e) {
      this.setData({ tempNickname: e.detail.value || '' });
    },

    onNicknameBlur(e) {
      this.setData({ tempNickname: e.detail.value || '' });
    },

    onLogin() {
      const { tempAvatar, tempNickname } = this.data;
      this.setData({ submitting: true });
      wx.showLoading({ title: '登录中' });

      // 如果选了新头像（临时文件），先上传到服务器换成永久 URL
      if (tempAvatar && tempAvatar.startsWith('wxfile://') || (tempAvatar && tempAvatar.indexOf('://') === -1)) {
        this.uploadAvatar(tempAvatar, (avatarUrl) => {
          this.wxLogin(tempNickname, avatarUrl);
        });
      } else {
        this.wxLogin(tempNickname, tempAvatar);
      }
    },

    uploadAvatar(filePath, callback) {
      const storageMod = require('../../utils/storage');
      const baseURLValue = storageMod.get('BASE_URL') || 'https://jlxt.jlyl.net.cn/api';
      wx.uploadFile({
        url: `${baseURLValue}/upload/avatar`,
        filePath: filePath,
        name: 'file',
        success: (res) => {
          try {
            const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            if (data && data.code === 0 && data.data && data.data.url) {
              callback(data.data.url);
            } else {
              // 上传失败也继续登录，用空头像
              callback('');
            }
          } catch (e) {
            callback('');
          }
        },
        fail: () => {
          callback('');
        }
      });
    },

    wxLogin(nickname, avatarUrl) {
      wx.login({
        success: (loginRes) => {
          if (loginRes.code) {
            this.doLogin(loginRes.code, nickname, avatarUrl);
          } else {
            this.setData({ submitting: false });
            wx.hideLoading();
            wx.showToast({ title: '登录失败', icon: 'none' });
          }
        },
        fail: () => {
          this.setData({ submitting: false });
          wx.hideLoading();
          wx.showToast({ title: '登录失败', icon: 'none' });
        }
      });
    },

    doLogin(code, nickname, avatar) {
      api.login(code, { nickName: nickname, avatarUrl: avatar })
        .then((res) => {
          wx.hideLoading();
          this.setData({ submitting: false });
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
          this.setData({ submitting: false });
          wx.showToast({ title: '登录失败', icon: 'none' });
        });
    }
  }
});
