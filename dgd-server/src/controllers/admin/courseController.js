const pool = require('../../config/database');
const response = require('../../utils/response');

exports.getCourses = async (req, res, next) => {
  try {
    const { category_id } = req.query;
    let sql = `SELECT c.*, cat.name AS category_name, l.name AS level_name
               FROM courses c
               LEFT JOIN categories cat ON c.category_id = cat.id
               LEFT JOIN levels l ON c.level_required = l.id`;
    const params = [];
    if (category_id) {
      sql += ' WHERE c.category_id = ?';
      params.push(category_id);
    }
    sql += ' ORDER BY c.sort_order ASC, c.id DESC';
    const [courses] = await pool.query(sql, params);
    res.json(response.success(courses));
  } catch (err) {
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const {
      title,
      cover,
      category_id,
      description,
      catalog,
      netdisk_resource,
      status,
      level_required,
      sort_order,
    } = req.body;
    if (!title) {
      return res.status(400).json(response.error(400, '课程标题不能为空'));
    }
    const [result] = await pool.query(
      `INSERT INTO courses
       (title, cover, category_id, description, catalog, netdisk_resource, publish_date, status, level_required, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`,
      [
        title,
        cover || '',
        category_id || null,
        description || '',
        catalog || '',
        netdisk_resource || '',
        status || 'published',
        level_required || null,
        sort_order || 0,
      ]
    );
    res.json(response.success({ id: result.insertId }));
  } catch (err) {
    next(err);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      cover,
      category_id,
      description,
      catalog,
      netdisk_resource,
      status,
      level_required,
      sort_order,
    } = req.body;
    if (!title) {
      return res.status(400).json(response.error(400, '课程标题不能为空'));
    }
    const [result] = await pool.query(
      `UPDATE courses SET
        title = ?, cover = ?, category_id = ?, description = ?, catalog = ?,
        netdisk_resource = ?, status = ?,
        level_required = ?, sort_order = ?
       WHERE id = ?`,
      [
        title,
        cover || '',
        category_id || null,
        description || '',
        catalog || '',
        netdisk_resource || '',
        status || 'published',
        level_required || null,
        sort_order || 0,
        id,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '课程不存在'));
    }
    res.json(response.success({ id: Number(id) }));
  } catch (err) {
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM courses WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '课程不存在'));
    }
    res.json(response.success({ id: Number(id) }));
  } catch (err) {
    next(err);
  }
};

exports.updateCourseStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json(response.error(400, '状态不能为空'));
    }
    const [result] = await pool.query(
      'UPDATE courses SET status = ? WHERE id = ?',
      [status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, '课程不存在'));
    }
    res.json(response.success({ id: Number(id), status }));
  } catch (err) {
    next(err);
  }
};
