const response = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json(response.error(statusCode, message));
};

module.exports = errorHandler;
