const pool = require('../config/database');
const response = require('../utils/response');

exports.getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const [users] = await pool.query(
      'SELECT u.id, u.nickname, u.avatar, u.level_id, l.name AS level_name FROM users u LEFT JOIN levels l ON u.level_id = l.id WHERE u.id = ?',
      [userId]
    );
    if (users.length === 0) {
      return res.status(404).json(response.error(404, '用户不存在'));
    }
    const user = users[0];
    res.json(
      response.success({
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        level_id: user.level_id,
        level_name: user.level_name || '普通用户',
      })
    );
  } catch (err) {
    next(err);
  }
};
