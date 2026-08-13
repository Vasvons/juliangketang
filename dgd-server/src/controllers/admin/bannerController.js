const pool = require('../../config/database');
const response = require('../../utils/response');

exports.getBanners = async (req, res, next) => {
  try {
    const [banners] = await pool.query(
      'SELECT * FROM banners ORDER BY sort_order ASC, id DESC'
    );
    res.json(response.success(banners));
  } catch (err) {
    next(err);
  }
};

exports.createBanner = async (req, res, next) => {
  try {
    const { image, link, sort_order, status } = req.body;
    if (!image) {
      return res.status(400).json(response.error(400, '图片不能为空'));
    }
    const [result] = await pool.query(
      'INSERT INTO banners (image, link, sort_order, status) VALUES (?, ?, ?, ?)',
      [image, link || '', sort_order || 0, status || 'active']
    );
    res.json(
      response.success({
        id: result.insertId,
        image,
        link: link || '',
        sort_order: sort_order || 0,
        status: status || 'active',
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { image, link, sort_order, status } = req.body;
    if (!image) {
      return res.status(400).json(response.error(400, '图片不能为空'));
    }
    const [result] = await pool.query(
      'UPDATE banners SET image = ?, link = ?, sort_order = ?, status = ? WHERE id = ?',
      [image, link || '', sort_order || 0, status || 'active', id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, 'Banner 不存在'));
    }
    res.json(response.success({ id: Number(id) }));
  } catch (err) {
    next(err);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM banners WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, 'Banner 不存在'));
    }
    res.json(response.success({ id: Number(id) }));
  } catch (err) {
    next(err);
  }
};

exports.updateBannerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json(response.error(400, '状态不能为空'));
    }
    const [result] = await pool.query(
      'UPDATE banners SET status = ? WHERE id = ?',
      [status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json(response.error(404, 'Banner 不存在'));
    }
    res.json(response.success({ id: Number(id), status }));
  } catch (err) {
    next(err);
  }
};
