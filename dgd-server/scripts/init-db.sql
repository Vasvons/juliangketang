-- 数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS dgd_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dgd_db;

-- 关闭外键检查，方便清空重建
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS ad_views;
DROP TABLE IF EXISTS activation_codes;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS levels;
DROP TABLE IF EXISTS banners;
DROP TABLE IF EXISTS notices;
DROP TABLE IF EXISTS page_configs;
DROP TABLE IF EXISTS admins;

SET FOREIGN_KEY_CHECKS = 1;

-- 用户等级表
CREATE TABLE levels (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL COMMENT '等级名称',
  description TEXT COMMENT '等级描述',
  sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
  status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '状态：active/disabled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_sort_order (sort_order),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户等级表';

-- 用户表
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  openid VARCHAR(128) NOT NULL COMMENT '微信 openid',
  unionid VARCHAR(128) DEFAULT NULL COMMENT '微信 unionid',
  nickname VARCHAR(100) DEFAULT NULL COMMENT '昵称',
  avatar VARCHAR(500) DEFAULT NULL COMMENT '头像 URL',
  level_id INT UNSIGNED DEFAULT NULL COMMENT '当前等级',
  status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '状态：active/disabled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_openid (openid),
  KEY idx_level_id (level_id),
  KEY idx_status (status),
  CONSTRAINT fk_users_level_id FOREIGN KEY (level_id) REFERENCES levels (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 分类表
CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  icon VARCHAR(100) DEFAULT NULL COMMENT '图标名/URL',
  color VARCHAR(20) DEFAULT NULL COMMENT '主题色',
  sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
  status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '状态：active/disabled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_sort_order (sort_order),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程分类表';

-- 课程资源表
CREATE TABLE courses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL COMMENT '课程标题',
  cover VARCHAR(500) DEFAULT NULL COMMENT '封面图 URL',
  category_id INT UNSIGNED DEFAULT NULL COMMENT '所属分类',
  description TEXT COMMENT '课程介绍',
  catalog TEXT COMMENT '课程目录（JSON 或文本）',
  netdisk_link VARCHAR(500) DEFAULT NULL COMMENT '网盘链接',
  netdisk_code VARCHAR(20) DEFAULT NULL COMMENT '网盘提取码',
  publish_date DATE DEFAULT NULL COMMENT '发布日期',
  status VARCHAR(20) NOT NULL DEFAULT 'published' COMMENT '状态：published/unlisted/disabled',
  level_required INT UNSIGNED DEFAULT NULL COMMENT '所需最低等级',
  sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_category_id (category_id),
  KEY idx_level_required (level_required),
  KEY idx_status (status),
  KEY idx_sort_order (sort_order),
  KEY idx_publish_date (publish_date),
  CONSTRAINT fk_courses_category_id FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
  CONSTRAINT fk_courses_level_required FOREIGN KEY (level_required) REFERENCES levels (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程资源表';

-- Banner 表
CREATE TABLE banners (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(500) NOT NULL COMMENT 'Banner 图片 URL',
  link VARCHAR(500) DEFAULT NULL COMMENT '跳转链接',
  sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
  status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '状态：active/disabled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_sort_order (sort_order),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Banner 表';

-- 滚动通知表
CREATE TABLE notices (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  content VARCHAR(255) NOT NULL COMMENT '通知内容',
  sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
  status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '状态：active/disabled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_sort_order (sort_order),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='滚动通知表';

-- 卡密表
CREATE TABLE activation_codes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(64) NOT NULL COMMENT '卡密字符串',
  level_id INT UNSIGNED NOT NULL COMMENT '可激活的等级',
  status ENUM('pending','used') NOT NULL DEFAULT 'pending' COMMENT '状态：pending 未使用 / used 已使用',
  used_by INT UNSIGNED DEFAULT NULL COMMENT '使用用户',
  used_at TIMESTAMP NULL DEFAULT NULL COMMENT '使用时间',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_code (code),
  KEY idx_level_id (level_id),
  KEY idx_status (status),
  KEY idx_used_by (used_by),
  CONSTRAINT fk_activation_codes_level_id FOREIGN KEY (level_id) REFERENCES levels (id) ON DELETE RESTRICT,
  CONSTRAINT fk_activation_codes_used_by FOREIGN KEY (used_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='卡密表';

-- 页面配置表
CREATE TABLE page_configs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  config_key VARCHAR(64) NOT NULL COMMENT '配置键',
  config_value TEXT COMMENT '配置值',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_config_key (config_key),
  KEY idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='页面配置表';

-- 广告观看记录表
CREATE TABLE ad_views (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL COMMENT '观看用户',
  course_id INT UNSIGNED NOT NULL COMMENT '关联课程',
  watched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '观看时间',
  KEY idx_user_id (user_id),
  KEY idx_course_id (course_id),
  KEY idx_watched_at (watched_at),
  CONSTRAINT fk_ad_views_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_ad_views_course_id FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='广告观看记录表';

-- 管理员表
CREATE TABLE admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL COMMENT '用户名',
  password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt 密码哈希',
  status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '状态：active/disabled',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_username (username),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';
