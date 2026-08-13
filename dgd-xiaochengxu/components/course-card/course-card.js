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
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
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
