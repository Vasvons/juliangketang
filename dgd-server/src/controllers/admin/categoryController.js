const pool = require('../../config/database');
const response = require('../../utils/response');

exports.getCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM categories ORDER BY sort_order ASC, id DESC'
    );
    res.json(response.success(categories));
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, icon, color, sort_order, status } = req.body;
    if (!name) {
      return res.status(400).json(response.error(400, '分类名称不能为空'));
    }
    const [result] = await pool.query(
      'INSERT INTO categories (name, icon, color, sort_order, status) VALUES (?, ?, ?, ?, ?)',
      [name, icon || '', color || '', sort_order || 0, status || 'active']
    );
    res.json(
      response.success({
        id: result.insertId,
        name,
        icon: icon || '',
        color: color || '',
        sort_order: sort_order || 0,
        status: status || 'active',
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, icon, color, sort_order, status } = req.body;
    if (!name) {
      return res.status(400).json(response.error(400, '分类名称不能为空'));
    }
    const [result] = await pool.query(
      'UPDATE categories SET name = ?, icon = ?, color = ?, sort_order = ?, status = ? WHERE id = ?',
      [name, icon || '', color || '', sort_order || 0, status || 'active', id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '分类不存在'));
    }
    res.json(response.success({ id: Number(id) }));
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '分类不存在'));
    }
    res.json(response.success({ id: Number(id) }));
  } catch (err) {
    next(err);
  }
};

exports.updateCategoryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json(response.error(400, '状态不能为空'));
    }
    const [result] = await pool.query(
      'UPDATE categories SET status = ? WHERE id = ?',
      [status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '分类不存在'));
    }
    res.json(response.success({ id: Number(id), status }));
  } catch (err) {
    next(err);
  }
};
