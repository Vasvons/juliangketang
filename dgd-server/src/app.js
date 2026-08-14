require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/error');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// 信任反向代理（Nginx），使 req.protocol 返回 https 而非 http
app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ code: 0, message: 'ok', data: { timestamp: new Date().toISOString() } });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // 幂等迁移：确保演示账号字段存在（已存在时忽略 ER_DUP_FIELDNAME 错误）
  pool
    .query("ALTER TABLE users ADD COLUMN is_demo TINYINT DEFAULT 0 COMMENT '是否演示账号'")
    .then(() => console.log('migration: users.is_demo added'))
    .catch((err) => {
      if (err && err.code !== 'ER_DUP_FIELDNAME') {
        console.error('migration is_demo failed:', err.message);
      }
    });

  // 幂等迁移：课程多图字段（TEXT 存 JSON 数组）
  pool
    .query("ALTER TABLE courses ADD COLUMN images TEXT COMMENT '课程图片 JSON 数组' AFTER cover")
    .then(() => console.log('migration: courses.images added'))
    .catch((err) => {
      if (err && err.code !== 'ER_DUP_FIELDNAME') {
        console.error('migration courses.images failed:', err.message);
      }
    });
});

module.exports = app;
