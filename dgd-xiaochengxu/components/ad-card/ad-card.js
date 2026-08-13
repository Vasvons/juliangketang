// components/ad-card/ad-card.js
Component({
  properties: {
    title: {
      type: String,
      value: '精选推荐'
    },
    desc: {
      type: String,
      value: '发现更多精彩内容'
    }
  },

  methods: {
    onTap() {
      wx.showToast({
        title: '广告位占位',
        icon: 'none'
      });
    }
  }
});
