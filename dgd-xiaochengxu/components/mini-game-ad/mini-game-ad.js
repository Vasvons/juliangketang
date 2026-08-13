// components/mini-game-ad/mini-game-ad.js
Component({
  properties: {
    title: {
      type: String,
      value: '趣味小游戏'
    },
    desc: {
      type: String,
      value: '无聊就来玩一玩，解压又好玩'
    }
  },

  methods: {
    onTap() {
      wx.navigateToMiniProgram({
        appId: 'wx1234567890abcdef',
        path: '',
        fail: () => {
          wx.showToast({
            title: '小游戏跳转失败',
            icon: 'none'
          });
        }
      });
    }
  }
});
