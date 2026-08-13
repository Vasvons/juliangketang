const pool = require('../../config/database');
const response = require('../../utils/response');

exports.getLevels = async (req, res, next) => {
  try {
    const [levels] = await pool.query(
      'SELECT * FROM levels ORDER BY sort_order ASC, id ASC'
    );
    res.json(response.success(levels));
  } catch (err) {
    next(err);
  }
};

exports.createLevel = async (req, res, next) => {
  try {
    const { name, description, sort_order, status } = req.body;
    if (!name) {
      return res.status(400).json(response.error(400, '等级名称不能为空'));
    }
    const [result] = await pool.query(
      'INSERT INTO levels (name, description, sort_order, status) VALUES (?, ?, ?, ?)',
      [name, description || '', sort_order || 0, status || 'active']
    );
    res.json(
      response.success({
        id: result.insertId,
        name,
        description: description || '',
        sort_order: sort_order || 0,
        status: status || 'active',
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.updateLevel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, sort_order, status } = req.body;
    if (!name) {
      return res.status(400).json(response.error(400, '等级名称不能为空'));
    }
    const [result] = await pool.query(
      'UPDATE levels SET name = ?, description = ?, sort_order = ?, status = ? WHERE id = ?',
      [name, description || '', sort_order || 0, status || 'active', id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '等级不存在'));
    }
    res.json(response.success({ id: Number(id) }));
  } catch (err) {
    next(err);
  }
};

exports.deleteLevel = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (Number(id) === 1) {
      return res.status(400).json(response.error(400, '普通用户等级不可删除'));
    }
    const [result] = await pool.query('DELETE FROM levels WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '等级不存在'));
    }
    res.json(response.success({ id: Number(id) }));
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json(response.error(400, '该等级已被使用，无法删除'));
    }
    next(err);
  }
};
