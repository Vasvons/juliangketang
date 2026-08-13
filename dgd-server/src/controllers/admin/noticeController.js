const pool = require('../../config/database');
const response = require('../../utils/response');

exports.getNotices = async (req, res, next) => {
  try {
    const [notices] = await pool.query(
      'SELECT * FROM notices ORDER BY sort_order ASC, id DESC'
    );
    res.json(response.success(notices));
  } catch (err) {
    next(err);
  }
};

exports.createNotice = async (req, res, next) => {
  try {
    const { content, sort_order, status } = req.body;
    if (!content) {
      return res.status(400).json(response.error(400, '通知内容不能为空'));
    }
    const [result] = await pool.query(
      'INSERT INTO notices (content, sort_order, status) VALUES (?, ?, ?)',
      [content, sort_order || 0, status || 'active']
    );
    res.json(
      response.success({
        id: result.insertId,
        content,
        sort_order: sort_order || 0,
        status: status || 'active',
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.updateNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, sort_order, status } = req.body;
    if (!content) {
      return res.status(400).json(response.error(400, '通知内容不能为空'));
    }
    const [result] = await pool.query(
      'UPDATE notices SET content = ?, sort_order = ?, status = ? WHERE id = ?',
      [content, sort_order || 0, status || 'active', id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '通知不存在'));
    }
    res.json(response.success({ id: Number(id) }));
  } catch (err) {
    next(err);
  }
};

exports.deleteNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM notices WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '通知不存在'));
    }
    res.json(response.success({ id: Number(id) }));
  } catch (err) {
    next(err);
  }
};

exports.updateNoticeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json(response.error(400, '状态不能为空'));
    }
    const [result] = await pool.query(
      'UPDATE notices SET status = ? WHERE id = ?',
      [status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '通知不存在'));
    }
    res.json(response.success({ id: Number(id), status }));
  } catch (err) {
    next(err);
  }
};
