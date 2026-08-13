require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    const sqlPath = path.join(__dirname, 'init-db.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');

    console.log('开始执行数据库迁移...');
    await connection.query(sql);
    console.log('数据库迁移执行成功');
  } catch (err) {
    console.error('数据库迁移失败:', err);
    throw err;
  } finally {
    await connection.end();
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
