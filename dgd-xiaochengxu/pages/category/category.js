// pages/category/category.js
const api = require('../../services/api');

const iconMap = {
  '实战项目': '/images/menu-icons/shizhan.png',
  '短视频': '/images/menu-icons/duanshipin.png',
  '引流推广': '/images/menu-icons/yinliu.png',
  '电商运营': '/images/menu-icons/dianshang.png',
  '文案写作': '/images/menu-icons/wenan.png',
  '自媒体': '/images/menu-icons/zimeiti.png',
  '社群营销': '/images/menu-icons/shequn.png',
  '其它': '/images/menu-icons/qita.png',
  '免费资源': '/images/menu-icons/mianfei.png'
};

Page({
  data: {
    categories: []
  },

  onLoad() {
    this.loadCategories();
  },

  onPullDownRefresh() {
    this.loadCategories().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadCategories() {
    wx.showLoading({ title: '加载中' });
    return api.getCategories()
      .then((res) => {
        wx.hideLoading();
        const data = res.data || res;
        const categories = (data || []).map(item => ({
          ...item,
          icon: iconMap[item.name] || item.icon
        }));
        this.setData({ categories });
      })
      .catch(() => {
        wx.hideLoading();
      });
  },

  onCategoryTap(e) {
    const { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/course-list/course-list?id=${item.id}&name=${encodeURIComponent(item.name)}`
    });
  }
});
