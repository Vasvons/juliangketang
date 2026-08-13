const pool = require('../config/database');
const response = require('../utils/response');

const buildRecentCourse = (course, minLevelId) => ({
  id: course.id,
  title: course.title,
  cover: course.cover,
  publish_date: course.publish_date,
  category_name: course.category_name,
  free: !course.level_required || course.level_required === minLevelId,
});

exports.getHome = async (req, res, next) => {
  try {
    const [banners] = await pool.query(
      'SELECT id, image, link, sort_order FROM banners WHERE status = ? ORDER BY sort_order ASC',
      ['active']
    );

    const [notices] = await pool.query(
      'SELECT id, content, sort_order FROM notices WHERE status = ? ORDER BY sort_order ASC',
      ['active']
    );

    const [categories] = await pool.query(
      'SELECT id, name, icon, color, sort_order FROM categories WHERE status = ? ORDER BY sort_order ASC LIMIT 9',
      ['active']
    );

    const [[minLevel]] = await pool.query('SELECT id FROM levels ORDER BY sort_order ASC LIMIT 1');
    const minLevelId = minLevel ? minLevel.id : 1;

    const [recentCourses] = await pool.query(
      `SELECT c.id, c.title, c.cover, c.publish_date, c.level_required, cat.name AS category_name
       FROM courses c
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.status = ?
       ORDER BY c.created_at DESC
       LIMIT 20`,
      ['published']
    );

    res.json(
      response.success({
        banners,
        notices,
        categories,
        recentCourses: recentCourses.map((course) => buildRecentCourse(course, minLevelId)),
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.getBanners = async (req, res, next) => {
  try {
    const [banners] = await pool.query(
      'SELECT id, image, link, sort_order FROM banners WHERE status = ? ORDER BY sort_order ASC',
      ['active']
    );
    res.json(response.success(banners));
  } catch (err) {
    next(err);
  }
};

exports.getRecommendCourses = async (req, res, next) => {
  try {
    const [[minLevel]] = await pool.query('SELECT id FROM levels ORDER BY sort_order ASC LIMIT 1');
    const minLevelId = minLevel ? minLevel.id : 1;

    const [courses] = await pool.query(
      `SELECT c.id, c.title, c.cover, c.publish_date, c.level_required, cat.name AS category_name
       FROM courses c
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.status = ?
       ORDER BY c.created_at DESC
       LIMIT 20`,
      ['published']
    );

    res.json(response.success(courses.map((course) => buildRecentCourse(course, minLevelId))));
  } catch (err) {
    next(err);
  }
};
