// pages/qrcode/qrcode.js
Page({
  data: {
    title: '二维码',
    url: ''
  },

  onLoad(options) {
    const { title, url } = options || {};
    const decodedTitle = title ? decodeURIComponent(title) : '二维码';
    const decodedUrl = url ? decodeURIComponent(url) : '';
    this.setData({
      title: decodedTitle,
      url: decodedUrl
    });
    if (decodedTitle) {
      wx.setNavigationBarTitle({ title: decodedTitle });
    }
  },

  onSaveImage() {
    const { url } = this.data;
    if (!url) {
      wx.showToast({ title: '图片地址为空', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '保存中' });
    wx.downloadFile({
      url,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.hideLoading();
            wx.showToast({ title: '保存成功', icon: 'success' });
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '保存失败', icon: 'none' });
          }
        });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '下载失败', icon: 'none' });
      }
    });
  }
});
