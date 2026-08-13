const pool = require('../../config/database');
const response = require('../../utils/response');

const CONFIG_KEYS = [
  'activation_page_intro',
  'activation_page_qrcode',
  'customer_service_qrcode',
  'about_us_qrcode',
  // 欢迎弹窗
  'welcome_popup_enabled',
  'welcome_popup_title',
  'welcome_popup_content',
];

exports.getPageConfigs = async (req, res, next) => {
  try {
    const [configs] = await pool.query(
      'SELECT config_key, config_value FROM page_configs'
    );
    const result = {};
    configs.forEach((item) => {
      result[item.config_key] = item.config_value;
    });
    CONFIG_KEYS.forEach((key) => {
      if (result[key] === undefined) {
        result[key] = '';
      }
    });
    res.json(response.success(result));
  } catch (err) {
    next(err);
  }
};

exports.updatePageConfigs = async (req, res, next) => {
  try {
    const updates = req.body || {};
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const key of CONFIG_KEYS) {
        const value = updates[key] === undefined ? '' : String(updates[key]);
        await connection.query(
          `INSERT INTO page_configs (config_key, config_value) VALUES (?, ?)
           ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)`,
          [key, value]
        );
      }
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
    res.json(response.success({ updated: CONFIG_KEYS }));
  } catch (err) {
    next(err);
  }
};
