# 抖工队学堂微信小程序及管理后台 Spec

## Why
用户希望复刻一个以课程资源分发为核心的微信小程序，包含首页、分类、卡密激活、个人中心四大模块，以及对应的管理后台，用于维护课程资源、广告位、卡密和用户等级。

## What Changes
- 创建微信小程序原生项目（WXML/WXSS/JS），实现首页、分类、卡密激活、我的、分类列表、课程详情等页面。
- 搭建后端服务（Node.js + Express + MySQL），提供课程、分类、Banner、通知、卡密、用户等级、资源地址等接口。
- 创建管理后台前端（Vue3 + Element Plus），支持登录、Banner/通知/分类/课程/卡密/用户等级/页面配置的管理。
- 接入微信小程序登录、激励视频广告、小程序互推广告组件。
- 实现卡密激活解锁 VIP 等级及对应资源访问权限。

## Impact
- 新增微信小程序客户端
- 新增后端 API 服务
- 新增管理后台前端
- 需要微信小程序 AppID、微信广告位 ID、服务器域名备案

## ADDED Requirements

### Requirement: 微信小程序首页
The system SHALL provide a home page with search bar, banner carousel, mini-game ad slot, scrolling notice, 10-menu grid, and "recently updated" resource card list.

#### Scenario: 首页菜单点击
- **WHEN** 用户点击前 9 个菜单图标
- **THEN** 跳转到对应分类的课程资源列表页

#### Scenario: 全部分类入口
- **WHEN** 用户点击"全部分类"
- **THEN** 跳转到底部 tab 中的"分类"页

### Requirement: 分类页
The system SHALL provide a category page listing all categories as cards, with a top mini-game ad slot.

#### Scenario: 分类卡片点击
- **WHEN** 用户点击某个分类卡片
- **THEN** 跳转到该分类下的课程资源列表页

### Requirement: 课程资源列表与详情
The system SHALL provide a course list page and a course detail page.

#### Scenario: 课程列表
- **WHEN** 用户进入分类资源列表页
- **THEN** 页面展示该分类下的课程卡片，每 8 张卡片后插入一个广告位

#### Scenario: 课程详情
- **WHEN** 用户点击课程卡片
- **THEN** 进入课程详情页，展示标题、上架日期、分类标签、广告位、封面、项目介绍、课程目录

### Requirement: 资源获取流程
The system SHALL require users to watch a rewarded video ad before revealing the Baidu Netdisk link and extraction code.

#### Scenario: 正常获取资源
- **WHEN** 用户点击"获取资源"
- **THEN** 弹出提示"观看一段广告即可获得此资源"
- **WHEN** 用户点击确定
- **THEN** 播放微信激励视频广告
- **WHEN** 广告完整播放完毕
- **THEN** 弹出"资源地址"弹窗，显示网盘链接和提取码，并提供复制按钮

### Requirement: 卡密激活
The system SHALL allow users to unlock VIP levels by entering an activation code.

#### Scenario: 未登录用户点击卡密激活
- **WHEN** 未登录用户点击"卡密激活"按钮
- **THEN** 弹出授权登录弹窗

#### Scenario: 已登录用户激活卡密
- **WHEN** 已登录用户点击"卡密激活"按钮
- **THEN** 弹出卡密输入弹窗
- **WHEN** 用户输入有效卡密并确认
- **THEN** 用户等级提升为卡密对应的 VIP 等级

### Requirement: 我的页面
The system SHALL provide a profile page with avatar, nickname, user level, and menu entries for activation, customer service, and about us.

#### Scenario: 菜单点击
- **WHEN** 用户点击"卡密激活"
- **THEN** 跳转到卡密激活 tab 页
- **WHEN** 用户点击"联系客服"或"关于我们"
- **THEN** 打开对应二维码图片页

### Requirement: 微信小程序广告
The system SHALL integrate WeChat mini-program ad components in the following locations:
- 首页 banner 与滚动通知之间的小游戏广告位
- 分类页顶部的小游戏广告位
- 课程卡片列表每 8 张后插入的广告位
- 课程详情页顶部的小游戏广告位

### Requirement: 后端服务
The system SHALL provide a RESTful backend using Node.js + Express + MySQL.

#### Scenario: API 支持
- **WHEN** 小程序或管理后台请求接口
- **THEN** 后端返回课程、分类、Banner、通知、卡密、用户等级、资源地址等数据

### Requirement: 管理后台
The system SHALL provide a web-based admin dashboard using Vue3 + Element Plus.

#### Scenario: 内容管理
- **WHEN** 管理员登录后台
- **THEN** 可以管理 Banner、滚动通知、分类、课程资源、卡密激活页内容、用户等级、卡密生成与状态

### Requirement: 数据模型
The system SHALL persist the following entities:
- 用户（openid, unionid, nickname, avatar, level, created_at）
- 分类（id, name, icon, color, sort_order, status）
- 课程资源（id, title, cover, category_id, description, catalog, netdisk_link, netdisk_code, publish_date, status, level_required）
- Banner（id, image, link, sort_order, status）
- 通知（id, content, sort_order, status）
- 用户等级（id, name, description, sort_order, status）
- 卡密（id, code, level_id, status, used_by, used_at, created_at）
- 页面配置（key, value）
- 广告观看记录（user_id, course_id, watched_at）

## MODIFIED Requirements
无

## REMOVED Requirements
无
