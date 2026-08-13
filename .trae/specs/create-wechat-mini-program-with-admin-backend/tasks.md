# Tasks

- [x] Task 1: 初始化项目结构并确定技术栈
  - [x] SubTask 1.1: 创建小程序原生项目骨架（pages、components、utils、services）
  - [x] SubTask 1.2: 创建 Node.js + Express + MySQL 后端项目骨架
  - [x] SubTask 1.3: 创建 Vue3 + Element Plus 管理后台项目骨架
  - [x] SubTask 1.4: 配置统一接口规范、错误处理、环境变量

- [x] Task 2: 设计并实现数据库表结构
  - [x] SubTask 2.1: 编写用户、分类、课程、Banner、通知、等级、卡密、页面配置、广告观看记录的 SQL 建表语句
  - [x] SubTask 2.2: 使用迁移脚本初始化数据库
  - [x] SubTask 2.3: 创建种子数据（示例分类、课程、Banner、通知）

- [x] Task 3: 开发后端核心接口
  - [x] SubTask 3.1: 实现微信小程序登录接口（wx.login + 用户信息解密）
  - [x] SubTask 3.2: 实现首页接口（banner、通知、分类、最近更新课程）
  - [x] SubTask 3.3: 实现分类列表与分类下课程列表接口
  - [x] SubTask 3.4: 实现课程详情接口（含权限控制）
  - [x] SubTask 3.5: 实现卡密激活接口
  - [x] SubTask 3.6: 实现资源地址获取接口（记录广告观看后返回网盘信息）
  - [x] SubTask 3.7: 实现 JWT 鉴权与管理后台登录接口

- [x] Task 4: 开发管理后台
  - [x] SubTask 4.1: 实现管理员登录页
  - [x] SubTask 4.2: 实现 Banner 管理（增删改查、排序、上下架）
  - [x] SubTask 4.3: 实现滚动通知管理
  - [x] SubTask 4.4: 实现分类管理（含图标颜色配置）
  - [x] SubTask 4.5: 实现课程资源管理（富文本编辑、网盘链接、目录、等级权限）
  - [x] SubTask 4.6: 实现用户等级管理
  - [x] SubTask 4.7: 实现卡密生成与管理（批量生成、状态查看）
  - [x] SubTask 4.8: 实现卡密激活页配置与客服/关于我们二维码配置

- [x] Task 5: 开发微信小程序首页与分类页
  - [x] SubTask 5.1: 实现搜索框、自定义导航栏
  - [x] SubTask 5.2: 实现 Banner 轮播组件
  - [x] SubTask 5.3: 实现小游戏广告位占位组件
  - [x] SubTask 5.4: 实现滚动通知组件
  - [x] SubTask 5.5: 实现 10 宫格菜单（前 9 个分类 + 全部分类）
  - [x] SubTask 5.6: 实现课程资源卡片组件
  - [x] SubTask 5.7: 实现"最近更新"列表与每 8 张插入广告位
  - [x] SubTask 5.8: 实现底部 tab 栏
  - [x] SubTask 5.9: 实现分类页（顶部广告 + 分类卡片列表）

- [x] Task 6: 开发课程列表与课程详情页
  - [x] SubTask 6.1: 实现分类下课程列表页
  - [x] SubTask 6.2: 实现课程详情页（标题、日期、标签、广告、封面、介绍、目录、底部操作栏）
  - [x] SubTask 6.3: 实现底部操作栏（首页、客服、卡密激活、获取资源）
  - [x] SubTask 6.4: 实现"获取资源"广告观看与资源地址弹窗

- [x] Task 7: 开发卡密激活页与我的页
  - [x] SubTask 7.1: 实现卡密激活页顶部背景、头像、等级、VIP 卡片
  - [x] SubTask 7.2: 实现会员介绍富文本展示
  - [x] SubTask 7.3: 实现开通流程二维码展示
  - [x] SubTask 7.4: 实现授权登录弹窗
  - [x] SubTask 7.5: 实现卡密输入弹窗与激活逻辑
  - [x] SubTask 7.6: 实现我的页（背景、头像、昵称、等级、菜单）
  - [x] SubTask 7.7: 实现客服/关于我们二维码图片页

- [x] Task 8: 接入微信小程序广告与登录
  - [x] SubTask 8.1: 接入 wx.login 获取 code 并调用后端登录接口
  - [x] SubTask 8.2: 接入微信用户信息授权
  - [x] SubTask 8.3: 接入激励视频广告（获取资源流程）
  - [x] SubTask 8.4: 接入小程序互推广告组件占位（banner/native）

- [x] Task 9: 联调、测试与收尾
  - [x] SubTask 9.1: 小程序与后端接口联调
  - [x] SubTask 9.2: 管理后台与后端接口联调
  - [x] SubTask 9.3: 编写接口测试用例或 Postman 集合
  - [x] SubTask 9.4: 整理项目启动说明与部署文档

# Task Dependencies
- Task 3 depends on Task 2
- Task 4 depends on Task 3
- Task 5 depends on Task 3
- Task 6 depends on Task 5
- Task 7 depends on Task 5
- Task 8 depends on Task 3 and Task 7
- Task 9 depends on Task 4, Task 6, Task 7, Task 8
