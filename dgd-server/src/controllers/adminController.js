const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const jwtConfig = require('../config/jwt');
const { comparePassword } = require('../utils/crypto');
const response = require('../utils/response');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json(response.error(400, '用户名和密码不能为空'));
    }

    const [admins] = await pool.query('SELECT * FROM admins WHERE username = ? AND status = ?', [
      username,
      'active',
    ]);

    if (admins.length === 0) {
      return res.status(401).json(response.error(401, '用户名或密码错误'));
    }

    const admin = admins[0];
    const isValid = await comparePassword(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json(response.error(401, '用户名或密码错误'));
    }

    const token = jwt.sign(
      {
        admin_id: admin.id,
        username: admin.username,
        is_admin: true,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return res.json(
      response.success({
        token,
        admin: {
          id: admin.id,
          username: admin.username,
        },
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const [[userCount]] = await pool.query('SELECT COUNT(*) AS count FROM users');
    const [[courseCount]] = await pool.query('SELECT COUNT(*) AS count FROM courses');
    const [[categoryCount]] = await pool.query('SELECT COUNT(*) AS count FROM categories');
    const [[codeCount]] = await pool.query('SELECT COUNT(*) AS count FROM activation_codes');
    const [[usedCodeCount]] = await pool.query(
      "SELECT COUNT(*) AS count FROM activation_codes WHERE status = 'used'"
    );

    res.json(
      response.success({
        userCount: userCount.count,
        courseCount: courseCount.count,
        categoryCount: categoryCount.count,
        codeCount: codeCount.count,
        usedCodeCount: usedCodeCount.count,
        unusedCodeCount: codeCount.count - usedCodeCount.count,
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      `SELECT u.id, u.openid, u.nickname, u.avatar, u.level_id, u.status, u.is_demo, u.created_at, l.name AS level_name
       FROM users u
       LEFT JOIN levels l ON u.level_id = l.id
       ORDER BY u.created_at DESC`
    );
    res.json(response.success(users));
  } catch (err) {
    next(err);
  }
};

exports.updateUserLevel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { level_id } = req.body;
    if (!level_id) {
      return res.status(400).json(response.error(400, '等级不能为空'));
    }
    const [levels] = await pool.query('SELECT id FROM levels WHERE id = ?', [level_id]);
    if (levels.length === 0) {
      return res.status(400).json(response.error(400, '等级不存在'));
    }
    const [result] = await pool.query('UPDATE users SET level_id = ? WHERE id = ?', [
      level_id,
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '用户不存在'));
    }
    res.json(response.success({ id: Number(id), level_id }));
  } catch (err) {
    next(err);
  }
};

exports.updateUserDemo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_demo } = req.body;
    const value = is_demo === true || is_demo === 1 ? 1 : 0;
    const [result] = await pool.query('UPDATE users SET is_demo = ? WHERE id = ?', [value, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '用户不存在'));
    }
    res.json(response.success({ id: Number(id), is_demo: value }));
  } catch (err) {
    next(err);
  }
};

exports.getActivationCodes = async (req, res, next) => {
  try {
    const [codes] = await pool.query(
      `SELECT ac.*, l.name AS level_name, u.nickname AS used_by_nickname
       FROM activation_codes ac
       LEFT JOIN levels l ON ac.level_id = l.id
       LEFT JOIN users u ON ac.used_by = u.id
       ORDER BY ac.created_at DESC`
    );
    res.json(response.success(codes));
  } catch (err) {
    next(err);
  }
};

exports.createCode = async (req, res, next) => {
  try {
    const { code, level_id } = req.body;
    if (!code || !level_id) {
      return res.status(400).json(response.error(400, '卡密和等级不能为空'));
    }

    const [result] = await pool.query(
      'INSERT INTO activation_codes (code, level_id, status) VALUES (?, ?, ?)',
      [code, level_id, 'pending']
    );

    res.json(
      response.success({
        id: result.insertId,
        code,
        level_id,
      })
    );
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json(response.error(400, '卡密已存在'));
    }
    next(err);
  }
};
