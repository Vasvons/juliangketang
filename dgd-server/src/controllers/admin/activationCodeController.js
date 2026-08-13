const pool = require('../../config/database');
const response = require('../../utils/response');

const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'DGD-';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if (i === 5) code += '-';
  }
  return code;
};

exports.getActivationCodes = async (req, res, next) => {
  try {
    const { status } = req.query;
    let sql = `SELECT ac.*, l.name AS level_name, u.nickname AS used_by_nickname
               FROM activation_codes ac
               LEFT JOIN levels l ON ac.level_id = l.id
               LEFT JOIN users u ON ac.used_by = u.id`;
    const params = [];
    if (status) {
      sql += ' WHERE ac.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY ac.created_at DESC';
    const [codes] = await pool.query(sql, params);
    res.json(response.success(codes));
  } catch (err) {
    next(err);
  }
};

exports.generateActivationCodes = async (req, res, next) => {
  try {
    const { level_id, count } = req.body;
    if (!level_id) {
      return res.status(400).json(response.error(400, '等级不能为空'));
    }
    const generateCount = Math.min(Math.max(Number(count) || 1, 1), 1000);

    const [levels] = await pool.query('SELECT id FROM levels WHERE id = ?', [
      level_id,
    ]);
    if (levels.length === 0) {
      return res.status(400).json(response.error(400, '等级不存在'));
    }

    const generated = [];
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (let i = 0; i < generateCount; i++) {
        let code = generateCode();
        let inserted = false;
        let attempts = 0;
        while (!inserted && attempts < 10) {
          try {
            const [result] = await connection.query(
              'INSERT INTO activation_codes (code, level_id, status) VALUES (?, ?, ?)',
              [code, level_id, 'pending']
            );
            generated.push({ id: result.insertId, code, level_id });
            inserted = true;
          } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              code = generateCode();
              attempts++;
            } else {
              throw err;
            }
          }
        }
      }
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    res.json(response.success({ count: generated.length, codes: generated }));
  } catch (err) {
    next(err);
  }
};

exports.deleteActivationCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      'DELETE FROM activation_codes WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '卡密不存在'));
    }
    res.json(response.success({ id: Number(id) }));
  } catch (err) {
    next(err);
  }
};
