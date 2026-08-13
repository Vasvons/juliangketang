// components/search-bar/search-bar.js
Component({
  properties: {
    placeholder: {
      type: String,
      value: '搜索您想要的'
    }
  },

  data: {
    keyword: ''
  },

  methods: {
    onInput(e) {
      this.setData({ keyword: e.detail.value });
    },

    onTap() {
      wx.showToast({
        title: '搜索功能开发中',
        icon: 'none'
      });
    }
  }
});
