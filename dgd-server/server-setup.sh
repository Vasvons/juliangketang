#!/bin/bash
# 服务器初始化脚本 — 只需在首次部署时运行一次
# 用法: bash server-setup.sh

set -e

PROJECT_DIR="/www/juliangketang"
SERVER_DIR="$PROJECT_DIR/dgd-server"

echo "========== 1. 创建项目目录 =========="
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

echo "========== 2. 克隆仓库 =========="
if [ -d "dgd-server/.git" ]; then
  echo "仓库已存在，跳过克隆"
else
  git clone https://github.com/Vasvons/juliangketang.git .
fi

echo "========== 3. 安装 Node.js =========="
if ! command -v node &> /dev/null; then
  curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
  sudo yum install -y nodejs
fi
echo "Node: $(node -v)"
echo "npm: $(npm -v)"

echo "========== 4. 安装 PM2 =========="
sudo npm install -g pm2

echo "========== 5. 安装 MySQL =========="
if ! command -v mysql &> /dev/null; then
  sudo yum install -y mysql-server
  sudo systemctl start mysqld
  sudo systemctl enable mysqld
  echo "MySQL 已安装，请手动设置 root 密码"
fi

echo "========== 6. 安装后端依赖 =========="
cd $SERVER_DIR
npm install --production

echo "========== 7. 配置环境变量 =========="
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "已创建 .env，请编辑填入实际配置: vi $SERVER_DIR/.env"
fi

echo "========== 8. 创建日志目录 =========="
mkdir -p logs

echo "========== 9. 初始化数据库 =========="
echo "请确认 .env 中的数据库配置正确后，运行:"
echo "  cd $SERVER_DIR && npm run db:reset"

echo "========== 10. 用 PM2 启动服务 =========="
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "========== 完成 =========="
echo "后续部署由 GitHub Actions 自动完成，无需再手动运行此脚本"
