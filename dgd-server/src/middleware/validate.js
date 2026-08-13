const { validationResult } = require('express-validator');
const response = require('../utils/response');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const messages = errors.array().map((e) => e.msg);
    return res.status(400).json(response.error(400, messages.join(', ')));
  };
};

module.exports = validate;
