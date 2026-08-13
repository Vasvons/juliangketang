// components/tab-bar/tab-bar.js
Component({
  properties: {
    active: {
      type: Number,
      value: 0
    }
  },

  data: {
    list: [
      { text: '首页', icon: 'home' },
      { text: '分类', icon: 'category' },
      { text: '激活', icon: 'activation' },
      { text: '我的', icon: 'profile' }
    ]
  },

  methods: {
    onSwitch(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('switch', { index });
    }
  }
});
