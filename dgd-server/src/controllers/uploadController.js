const response = require('../utils/response');

exports.uploadImage = async (req, res, next) => {
  try {
    res.json(response.success({ url: '' }));
  } catch (err) {
    next(err);
  }
};
