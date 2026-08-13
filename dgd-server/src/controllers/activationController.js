const pool = require('../config/database');
const response = require('../utils/response');

exports.activateCode = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json(response.error(400, '请输入卡密'));
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [codes] = await connection.query(
        'SELECT * FROM activation_codes WHERE code = ? AND status = ? FOR UPDATE',
        [code, 'pending']
      );

      if (codes.length === 0) {
        await connection.rollback();
        return res.status(400).json(response.error(400, '卡密无效或已被使用'));
      }

      const activationCode = codes[0];

      await connection.query(
        "UPDATE activation_codes SET status = 'used', used_by = ?, used_at = NOW() WHERE id = ?",
        [userId, activationCode.id]
      );

      await connection.query('UPDATE users SET level_id = ? WHERE id = ?', [
        activationCode.level_id,
        userId,
      ]);

      const [[level]] = await connection.query('SELECT id, name FROM levels WHERE id = ?', [
        activationCode.level_id,
      ]);

      await connection.commit();

      res.json(
        response.success({
          level_id: activationCode.level_id,
          level_name: level ? level.name : '',
        })
      );
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    next(err);
  }
};
