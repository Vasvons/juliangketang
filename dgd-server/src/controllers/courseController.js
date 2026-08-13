const pool = require('../config/database');
const response = require('../utils/response');

exports.getCourses = async (req, res, next) => {
  try {
    const [courses] = await pool.query(
      `SELECT c.id, c.title, c.cover, c.publish_date, cat.name AS category_name
       FROM courses c
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.status = ?
       ORDER BY c.created_at DESC`,
      ['published']
    );
    res.json(response.success(courses));
  } catch (err) {
    next(err);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [courses] = await pool.query(
      `SELECT c.id, c.title, c.cover, c.description, c.catalog, c.publish_date,
              c.category_id, cat.name AS category_name, c.level_required, l.name AS level_name
       FROM courses c
       LEFT JOIN categories cat ON c.category_id = cat.id
       LEFT JOIN levels l ON c.level_required = l.id
       WHERE c.id = ? AND c.status = ?`,
      [id, 'published']
    );

    if (courses.length === 0) {
      return res.status(404).json(response.error(404, '课程不存在'));
    }

    res.json(response.success(courses[0]));
  } catch (err) {
    next(err);
  }
};

exports.getCourseChapters = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [courses] = await pool.query('SELECT catalog FROM courses WHERE id = ? AND status = ?', [
      id,
      'published',
    ]);
    if (courses.length === 0) {
      return res.status(404).json(response.error(404, '课程不存在'));
    }
    const catalogText = courses[0].catalog || '';
    const chapters = catalogText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    res.json(response.success(chapters));
  } catch (err) {
    next(err);
  }
};

exports.getCourseResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const [courses] = await pool.query(
      'SELECT id, title, level_required, netdisk_resource FROM courses WHERE id = ? AND status = ?',
      [id, 'published']
    );
    if (courses.length === 0) {
      return res.status(404).json(response.error(404, '课程不存在'));
    }
    const course = courses[0];

    const [users] = await pool.query('SELECT level_id FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json(response.error(404, '用户不存在'));
    }
    const userLevelId = users[0].level_id || 1;
    const requiredLevelId = course.level_required || 1;

    if (userLevelId < requiredLevelId) {
      return res
        .status(403)
        .json(response.error(403, '当前等级无法获取该资源，请先激活卡密'));
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [existingViews] = await pool.query(
      `SELECT id FROM ad_views
       WHERE user_id = ? AND course_id = ? AND watched_at >= ?
       ORDER BY watched_at DESC
       LIMIT 1`,
      [userId, id, twentyFourHoursAgo]
    );

    if (existingViews.length === 0) {
      await pool.query('INSERT INTO ad_views (user_id, course_id, watched_at) VALUES (?, ?, NOW())', [
        userId,
        id,
      ]);
    }

    res.json(
      response.success({
        netdisk_resource: course.netdisk_resource || '',
      })
    );
  } catch (err) {
    next(err);
  }
};
