// components/resource-modal/resource-modal.js
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    resource: {
      type: String,
      value: ''
    }
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    },

    onCopy(e) {
      const { text } = e.currentTarget.dataset;
      wx.setClipboardData({
        data: text,
        success: () => {
          wx.showToast({ title: '复制成功', icon: 'success' });
        }
      });
    },

    onNoop() {}
  }
});
