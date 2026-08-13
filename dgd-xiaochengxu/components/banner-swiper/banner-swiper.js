// components/banner-swiper/banner-swiper.js
Component({
  properties: {
    banners: {
      type: Array,
      value: []
    }
  },

  data: {
    current: 0
  },

  methods: {
    onChange(e) {
      this.setData({ current: e.detail.current });
    }
  }
});
