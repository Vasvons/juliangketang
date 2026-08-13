Component({
  properties: {
    categories: {
      type: Array,
      value: []
    }
  },

  data: {
    list: []
  },

  observers: {
    categories(val) {
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

      const list = (val || []).slice(0, 9).map(item => {
        const name = item.name || '';
        return {
          id: item.id,
          name,
          icon: iconMap[name] || item.icon,
          color: item.color || '#ff6600',
          type: 'category'
        };
      });
      list.push({
        id: 'all',
        name: '全部分类',
        icon: '/images/menu-icons/quanbu.png',
        color: '#ff80ab',
        type: 'all'
      });
      this.setData({ list });
    }
  },

  methods: {
    onTap(e) {
      const { item } = e.currentTarget.dataset;
      if (item.type === 'all') {
        wx.switchTab({ url: '/pages/category/category' });
      } else {
        wx.navigateTo({
          url: `/pages/course-list/course-list?id=${item.id}&name=${encodeURIComponent(item.name)}`
        });
      }
    }
  }
});
