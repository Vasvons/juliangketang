const success = (data = null, message = 'success') => {
  return {
    code: 0,
    message,
    data: data === null ? {} : data,
  };
};

const error = (code = -1, message = 'error', data = null) => {
  return {
    code,
    message,
    data: data === null ? {} : data,
  };
};

module.exports = {
  success,
  error,
};
