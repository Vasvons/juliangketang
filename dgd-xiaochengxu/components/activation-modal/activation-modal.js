// components/activation-modal/activation-modal.js
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },

  data: {
    code: ''
  },

  methods: {
    onInput(e) {
      this.setData({ code: e.detail.value });
    },

    onClose() {
      this.setData({ code: '' });
      this.triggerEvent('close');
    },

    onCancel() {
      this.setData({ code: '' });
      this.triggerEvent('close');
    },

    onConfirm() {
      const { code } = this.data;
      if (!code.trim()) {
        wx.showToast({ title: '请输入卡密', icon: 'none' });
        return;
      }
      this.triggerEvent('confirm', { code: code.trim() });
      this.setData({ code: '' });
    },

    onNoop() {}
  }
});
