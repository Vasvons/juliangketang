// components/course-card/course-card.js
Component({
  properties: {
    course: {
      type: Object,
      value: {}
    }
  },

  data: {
    displayDate: ''
  },

  observers: {
    course(val) {
      this.setData({ displayDate: this.formatDate(val && val.publish_date) });
    }
  },

  methods: {
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return date;
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    },
    onTap() {
      const { course } = this.data;
      if (course && course.id) {
        wx.navigateTo({
          url: `/pages/course-detail/course-detail?id=${course.id}`
        });
      }
    }
  }
});
