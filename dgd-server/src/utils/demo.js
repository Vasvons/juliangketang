const pool = require('../config/database');

// 判断用户是否为演示账号（未登录返回 false）
async function isDemoUser(userId) {
  if (!userId) return false;
  const [users] = await pool.query('SELECT is_demo FROM users WHERE id = ?', [userId]);
  return users.length > 0 && users[0].is_demo === 1;
}

module.exports = { isDemoUser };
