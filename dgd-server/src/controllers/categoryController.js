const pool = require('../config/database');
const response = require('../utils/response');

const buildCourseItem = (course, minLevelId) => ({
  id: course.id,
  title: course.title,
  cover: course.cover,
  publish_date: course.publish_date,
  category_name: course.category_name,
  free: !course.level_required || course.level_required === minLevelId,
});

exports.getCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query(
      'SELECT id, name, icon, color, sort_order FROM categories WHERE status = ? ORDER BY sort_order ASC',
      ['active']
    );
    res.json(response.success(categories));
  } catch (err) {
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [categories] = await pool.query(
      'SELECT id, name, icon, color, sort_order FROM categories WHERE id = ? AND status = ?',
      [id, 'active']
    );
    if (categories.length === 0) {
      return res.status(404).json(response.error(404, '分类不存在'));
    }
    res.json(response.success(categories[0]));
  } catch (err) {
    next(err);
  }
};

exports.getCategoryCourses = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [categories] = await pool.query(
      'SELECT id FROM categories WHERE id = ? AND status = ?',
      [id, 'active']
    );
    if (categories.length === 0) {
      return res.status(404).json(response.error(404, '分类不存在'));
    }

    const [[minLevel]] = await pool.query('SELECT id FROM levels ORDER BY sort_order ASC LIMIT 1');
    const minLevelId = minLevel ? minLevel.id : 1;

    const [courses] = await pool.query(
      `SELECT c.id, c.title, c.cover, c.publish_date, c.level_required, cat.name AS category_name
       FROM courses c
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.category_id = ? AND c.status = ?
       ORDER BY c.sort_order ASC, c.created_at DESC`,
      [id, 'published']
    );

    res.json(response.success(courses.map((course) => buildCourseItem(course, minLevelId))));
  } catch (err) {
    next(err);
  }
};
