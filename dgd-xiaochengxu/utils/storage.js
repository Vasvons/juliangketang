// utils/storage.js

const storage = {
  get(key, defaultValue = '') {
    try {
      const value = wx.getStorageSync(key);
      return value === '' || value === undefined || value === null ? defaultValue : value;
    } catch (e) {
      console.error('storage get error', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      wx.setStorageSync(key, value);
      return true;
    } catch (e) {
      console.error('storage set error', e);
      return false;
    }
  },

  remove(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error('storage remove error', e);
      return false;
    }
  },

  clear() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('storage clear error', e);
      return false;
    }
  }
};

module.exports = storage;
