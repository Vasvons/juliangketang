// components/notice-bar/notice-bar.js
Component({
  properties: {
    notices: {
      type: Array,
      value: []
    }
  },

  data: {
    content: ''
  },

  observers: {
    notices(val) {
      const content = (val || []).map(item => item.content).filter(Boolean).join('   ');
      this.setData({ content });
    }
  }
});
