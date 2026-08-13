require('dotenv').config();
const pool = require('../src/config/database');
const { hashPassword } = require('../src/utils/crypto');

async function clearTables(connection) {
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');
  const tables = [
    'ad_views',
    'activation_codes',
    'courses',
    'categories',
    'users',
    'levels',
    'banners',
    'notices',
    'page_configs',
    'admins',
  ];
  for (const table of tables) {
    await connection.query(`TRUNCATE TABLE ${table}`);
  }
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');
}

async function seed() {
  const connection = await pool.getConnection();
  try {
    console.log('开始清空旧数据...');
    await clearTables(connection);

    console.log('插入用户等级...');
    await connection.query(
      'INSERT INTO levels (id, name, description, sort_order, status) VALUES ?',
      [
        [
          [1, '普通用户', '注册即可使用的基础权限', 1, 'active'],
          [2, 'VIP 会员', '解锁全部课程与资源下载', 2, 'active'],
        ],
      ]
    );

    console.log('插入分类...');
    await connection.query(
      'INSERT INTO categories (id, name, icon, color, sort_order, status) VALUES ?',
      [
        [
          [1, '实战项目', 'icon-project', '#ff6600', 1, 'active'],
          [2, '短视频', 'icon-video', '#ff3366', 2, 'active'],
          [3, '引流推广', 'icon-promote', '#9c6ade', 3, 'active'],
          [4, '电商运营', 'icon-shop', '#ff4081', 4, 'active'],
          [5, '文案写作', 'icon-write', '#ff5722', 5, 'active'],
          [6, '自媒体', 'icon-media', '#4cd964', 6, 'active'],
          [7, '社群营销', 'icon-community', '#26c6da', 7, 'active'],
          [8, '其它', 'icon-other', '#ff9800', 8, 'active'],
          [9, '免费资源', 'icon-free', '#ff7043', 9, 'active'],
        ],
      ]
    );

    console.log('插入 Banner...');
    await connection.query(
      'INSERT INTO banners (image, link, sort_order, status) VALUES ?',
      [
        [
          ['https://example.com/banner-1.jpg', '/pages/course-list/course-list?id=1', 1, 'active'],
          ['https://example.com/banner-2.jpg', '/pages/activation/activation', 2, 'active'],
          ['https://example.com/banner-3.jpg', '/pages/category/category', 3, 'active'],
        ],
      ]
    );

    console.log('插入滚动通知...');
    await connection.query(
      'INSERT INTO notices (content, sort_order, status) VALUES ?',
      [
        [
          ['欢迎加入抖工队学堂，开启学习之旅！', 1, 'active'],
          ['VIP 会员可解锁全部课程资源与网盘链接', 2, 'active'],
          ['每日更新实战项目与短视频运营干货', 3, 'active'],
        ],
      ]
    );

    console.log('插入课程资源...');
    await connection.query(
      'INSERT INTO courses (title, cover, category_id, description, catalog, netdisk_resource, publish_date, status, level_required, sort_order) VALUES ?',
      [
        [
          [
            '抖音小店从0到1实战课',
            'https://example.com/cover-1.jpg',
            4,
            '系统讲解抖音小店开店、选品、上架、动销全流程。',
            '第一章 开店准备\n第二章 选品策略\n第三章 上架优化\n第四章 动销推广',
            '链接：https://pan.baidu.com/s/1example1\n提取码：abcd\n复制这段内容后打开百度网盘手机App，操作更方便哦',
            '2024-01-15',
            'published',
            2,
            1,
          ],
          [
            '短视频爆款文案写作指南',
            'https://example.com/cover-2.jpg',
            5,
            '拆解100+爆款文案，掌握黄金3秒钩子写法。',
            '第一节 钩子公式\n第二节 情绪共鸣\n第三节 行动号召',
            '链接：https://pan.baidu.com/s/1example2\n提取码：efgh\n复制这段内容后打开百度网盘手机App，操作更方便哦',
            '2024-02-10',
            'published',
            null,
            2,
          ],
          [
            '小红书引流推广全攻略',
            'https://example.com/cover-3.jpg',
            3,
            '小红书笔记、聚光投放、私域引流一站式教程。',
            '模块一 账号定位\n模块二 笔记创作\n模块三 投放技巧\n模块四 私域承接',
            '链接：https://pan.baidu.com/s/1example3\n提取码：ijkl\n复制这段内容后打开百度网盘手机App，操作更方便哦',
            '2024-03-05',
            'published',
            2,
            3,
          ],
          [
            '直播带货实战项目拆解',
            'https://example.com/cover-4.jpg',
            1,
            '真实直播间案例复盘，从话术到排品全链路。',
            '项目一 服装直播\n项目二 食品直播\n项目三 美妆直播',
            '链接：https://pan.baidu.com/s/1example4\n提取码：mnop\n复制这段内容后打开百度网盘手机App，操作更方便哦',
            '2024-03-20',
            'published',
            2,
            4,
          ],
          [
            '微信社群运营SOP',
            'https://example.com/cover-5.jpg',
            7,
            '社群拉新、活跃、转化、复购的标准化流程。',
            '第一章 社群定位\n第二章 拉新玩法\n第三章 日常活跃\n第四章 转化复购',
            '链接：https://pan.baidu.com/s/1example5\n提取码：qrst\n复制这段内容后打开百度网盘手机App，操作更方便哦',
            '2024-04-01',
            'published',
            null,
            5,
          ],
          [
            '自媒体多平台分发手册',
            'https://example.com/cover-6.jpg',
            6,
            '一篇内容多平台分发，提升曝光效率。',
            '第一节 平台规则\n第二节 内容适配\n第三节 数据分析',
            '链接：https://pan.baidu.com/s/1example6\n提取码：uvwx\n复制这段内容后打开百度网盘手机App，操作更方便哦',
            '2024-04-15',
            'published',
            null,
            6,
          ],
          [
            '短视频拍摄与剪辑入门',
            'https://example.com/cover-7.jpg',
            2,
            '零基础学习手机拍摄与剪映剪辑。',
            '第一章 拍摄基础\n第二章 运镜技巧\n第三章 剪映实操',
            '链接：https://pan.baidu.com/s/1example7\n提取码：yz12\n复制这段内容后打开百度网盘手机App，操作更方便哦',
            '2024-05-01',
            'published',
            null,
            7,
          ],
          [
            '免费资源：电商运营资料包',
            'https://example.com/cover-8.jpg',
            9,
            '精选电商运营表格、话术、选品清单，免费领取。',
            '资料一 选品表\n资料二 话术库\n资料三 数据报表模板',
            '链接：https://pan.baidu.com/s/1example8\n提取码：3456\n复制这段内容后打开百度网盘手机App，操作更方便哦',
            '2024-05-10',
            'published',
            null,
            8,
          ],
          [
            '短视频算法解密与起号方法论',
            'https://example.com/cover-9.jpg',
            2,
            '深入解析平台推荐机制，掌握快速起号核心逻辑。',
            '第一章 推荐算法\n第二章 账号标签\n第三章 内容模型\n第四章 数据分析',
            '链接：https://pan.baidu.com/s/1example9\n提取码：7890\n复制这段内容后打开百度网盘手机App，操作更方便哦',
            '2024-05-20',
            'published',
            2,
            9,
          ],
          [
            '私域成交高转化训练营',
            'https://example.com/cover-10.jpg',
            8,
            '从朋友圈到一对一成交，打造高转化私域体系。',
            '第一节 人设打造\n第二节 朋友圈布局\n第三节 成交话术\n第四节 复购裂变',
            '链接：https://pan.baidu.com/s/1example10\n提取码：abcd\n复制这段内容后打开百度网盘手机App，操作更方便哦',
            '2024-06-01',
            'published',
            2,
            10,
          ],
        ],
      ]
    );

    console.log('插入管理员账号...');
    const adminHash = await hashPassword('123456');
    await connection.query(
      'INSERT INTO admins (username, password_hash, status) VALUES ?',
      [[['admin', adminHash, 'active']]]
    );

    console.log('插入页面配置...');
    await connection.query(
      'INSERT INTO page_configs (config_key, config_value) VALUES ?',
      [
        [
          [
            'activation_page_intro',
            '<div class="intro"><h2>开通 VIP 会员</h2><p>解锁全部实战项目、短视频运营、引流推广等精品课程资源。</p><ul><li>海量课程无限观看</li><li>网盘资源一键获取</li><li>专属社群答疑解惑</li></ul></div>',
          ],
          ['activation_page_qrcode', 'https://example.com/qrcode-vip.png'],
          ['customer_service_qrcode', 'https://example.com/qrcode-customer-service.png'],
          ['about_us_qrcode', 'https://example.com/qrcode-about-us.png'],
          ['contact_phone', '400-123-4567'],
        ],
      ]
    );

    console.log('插入示例卡密...');
    await connection.query(
      'INSERT INTO activation_codes (code, level_id, status) VALUES ?',
      [
        [
          ['VIP-2024-001', 2, 'pending'],
          ['VIP-2024-002', 2, 'pending'],
          ['VIP-2024-003', 2, 'pending'],
          ['VIP-2024-004', 2, 'pending'],
          ['VIP-2024-005', 2, 'pending'],
        ],
      ]
    );

    console.log('种子数据插入完成');
  } catch (err) {
    console.error('种子数据写入失败:', err);
    throw err;
  } finally {
    connection.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
