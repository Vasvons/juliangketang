# DGD 项目（抖工队学堂）

DGD 项目是一个面向微信小程序的实战课程资源平台，包含课程分类、课程详情、卡密激活、资源下载等功能，并配套 Vue3 管理后台进行内容运营。

## 技术栈

- **后端（dgd-server）**：Node.js + Express + MySQL + JWT
- **管理后台（dgd-admin）**：Vue 3 + Vite + Element Plus + Pinia
- **微信小程序（dgd-xiaochengxu）**：微信小程序原生框架

## 目录结构

```
.
├── dgd-server/          # Node.js 后端服务
│   ├── src/             # 源码
│   │   ├── controllers/ # 控制器
│   │   ├── routes/      # 路由
│   │   ├── middleware/  # 中间件
│   │   ├── config/      # 配置（数据库、JWT、微信）
│   │   └── utils/       # 工具函数
│   ├── scripts/         # 数据库迁移与种子脚本
│   ├── tests/           # 接口测试脚本
│   └── uploads/         # 上传文件目录
├── dgd-admin/           # Vue3 管理后台
│   ├── src/
│   │   ├── api/         # API 接口模块
│   │   ├── views/       # 页面视图
│   │   ├── router/      # 路由
│   │   └── stores/      # Pinia 状态管理
│   └── dist/            # 构建产物
└── dgd-xiaochengxu/     # 微信小程序
    ├── pages/           # 页面
    ├── components/      # 组件
    ├── services/        # API 服务
    └── utils/           # 工具函数
```

## 环境要求

- Node.js >= 18
- MySQL >= 5.7
- 微信开发者工具（用于小程序预览与调试）

## 后端启动步骤

进入 `dgd-server` 目录：

```bash
cd dgd-server
```

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并根据实际情况修改：

```env
PORT=3000

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=dgd_db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# WeChat Mini Program
WECHAT_APPID=your_wechat_appid
WECHAT_SECRET=your_wechat_secret
```

### 3. 初始化数据库

```bash
npm run migrate   # 创建数据库与表结构
npm run seed      # 写入种子数据
```

或一次性执行：

```bash
npm run db:reset
```

### 4. 启动服务

```bash
npm start
```

开发模式（热更新）：

```bash
npm run dev
```

服务默认运行在 `http://localhost:3000`。

## 管理后台启动步骤

进入 `dgd-admin` 目录：

```bash
cd dgd-admin
```

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API 地址

开发环境已配置 `.env.development`：

```env
VITE_API_BASE_URL=http://localhost:3000/api/admin
```

生产环境可在 `.env.production` 中配置为相对路径或线上地址。

### 3. 启动开发服务器

```bash
npm run dev
```

默认地址为 `http://localhost:5173`。

### 4. 登录

- 账号：`admin`
- 密码：`123456`

## 微信小程序启动步骤

1. 打开微信开发者工具。
2. 选择「导入项目」，目录选择 `dgd-xiaochengxu`。
3. 在 `project.config.json` 中配置或填写你的小程序 `appid`（测试阶段可使用测试号）。
4. 在「详情」->「本地设置」中勾选「不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书」，以便本地调试。
5. 在 `utils/request.js` 中确认 `DEFAULT_BASE_URL` 指向 `http://localhost:3000/api`（本地调试）。
6. 编译预览即可。

## 线上部署注意事项

1. **服务器域名**：在微信小程序后台「开发管理」->「开发设置」->「服务器域名」中配置 `request 合法域名` 为线上 HTTPS 域名。
2. **HTTPS**：线上后端必须使用 HTTPS，微信小程序不支持 HTTP 请求。
3. **微信小程序配置**：将 `project.config.json` 中的 `appid` 替换为正式小程序 AppID。
4. **广告位 ID**：在 `pages/course-detail/course-detail.js` 中，将 `adUnitId: 'adunit-test'` 替换为微信小程序后台申请的真实激励视频广告位 ID。
5. **管理后台部署**：构建 `dgd-admin` 项目（`npm run build`），将 `dist` 目录部署到静态服务器或 CDN，并配置接口代理到后端服务。

## 默认账号信息

- **管理后台**：`admin` / `123456`
- **测试卡密**：`VIP-2024-001` ~ `VIP-2024-005`

## 接口测试脚本使用方式

确保后端服务已启动（`npm start`），然后执行：

```bash
cd dgd-server
node tests/api-test.js
```

脚本会依次测试公开接口、需登录接口和管理后台接口，并打印每个接口的通过/失败状态。
