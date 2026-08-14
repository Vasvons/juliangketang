const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const response = require('../utils/response');

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

const authenticateUser = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json(response.error(401, '请先登录'));
  }
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    if (!decoded.user_id) {
      return res.status(401).json(response.error(401, '无效的登录凭证'));
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(response.error(401, '登录凭证已过期或无效'));
  }
};

// 可选用户认证：有 token 且有效时注入 req.user，无效或缺失时放行
const optionalUser = (req, res, next) => {
  const token = extractToken(req);
  if (token) {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      if (decoded.user_id) {
        req.user = decoded;
      }
    } catch (err) {
      // 忽略无效 token，按未登录处理
    }
  }
  next();
};

const authenticateAdmin = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json(response.error(401, '请先登录'));
  }
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    if (!decoded.admin_id || !decoded.is_admin) {
      return res.status(403).json(response.error(403, '无权访问'));
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(response.error(401, '登录凭证已过期或无效'));
  }
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
  optionalUser,
};
