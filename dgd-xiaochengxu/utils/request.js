// utils/request.js
const storage = require('./storage');

// 默认 baseURL，后续可从 storage 或环境读取
const DEFAULT_BASE_URL = 'https://jlxt.jlyl.net.cn/api';

// 请求拦截器
const requestInterceptors = [];
// 响应拦截器
const responseInterceptors = [];

function getBaseURL() {
  // 优先从本地缓存读取
  return storage.get('BASE_URL') || DEFAULT_BASE_URL;
}

function getToken() {
  return storage.get('TOKEN') || '';
}

function addRequestInterceptor(interceptor) {
  if (typeof interceptor === 'function') {
    requestInterceptors.push(interceptor);
  }
}

function addResponseInterceptor(interceptor) {
  if (typeof interceptor === 'function') {
    responseInterceptors.push(interceptor);
  }
}

function showError(msg) {
  wx.showToast({
    title: msg || '请求失败',
    icon: 'none',
    duration: 2000
  });
}

function request(options = {}) {
  return new Promise((resolve, reject) => {
    let config = {
      url: '',
      method: 'GET',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      timeout: 15000,
      dataType: 'json',
      responseType: 'text',
      ...options
    };

    // 处理 URL
    if (!config.url.startsWith('http')) {
      config.url = getBaseURL() + config.url;
    }

    // 注入 token
    const token = getToken();
    if (token) {
      config.header.Authorization = `Bearer ${token}`;
    }

    // 请求拦截
    try {
      requestInterceptors.forEach(fn => {
        config = fn(config) || config;
      });
    } catch (err) {
      showError(err.message);
      return reject(err);
    }

    wx.request({
      ...config,
      success: (res) => {
        let result = res;

        // 响应拦截
        try {
          responseInterceptors.forEach(fn => {
            result = fn(result) || result;
          });
        } catch (err) {
          showError(err.message);
          return reject(err);
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 业务码判断（可按后端约定调整）
          if (res.data && res.data.code !== undefined && res.data.code !== 0 && res.data.code !== 200) {
            const msg = res.data.message || res.data.msg || '业务错误';
            showError(msg);
            return reject(new Error(msg));
          }
          resolve(res.data);
        } else {
          const msg = res.data && (res.data.message || res.data.msg) ? res.data.message || res.data.msg : `HTTP ${res.statusCode}`;
          showError(msg);
          reject(new Error(msg));
        }
      },
      fail: (err) => {
        const msg = err.errMsg || '网络请求失败';
        showError(msg);
        reject(new Error(msg));
      }
    });
  });
}

// 便捷方法
const http = {
  get(url, params = {}, options = {}) {
    return request({ ...options, url, method: 'GET', data: params });
  },
  post(url, data = {}, options = {}) {
    return request({ ...options, url, method: 'POST', data });
  },
  put(url, data = {}, options = {}) {
    return request({ ...options, url, method: 'PUT', data });
  },
  delete(url, params = {}, options = {}) {
    return request({ ...options, url, method: 'DELETE', data: params });
  },
  addRequestInterceptor,
  addResponseInterceptor,
  setBaseURL(url) {
    storage.set('BASE_URL', url);
  },
  setToken(token) {
    storage.set('TOKEN', token);
  }
};

module.exports = http;
