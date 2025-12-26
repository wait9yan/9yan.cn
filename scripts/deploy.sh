#!/bin/bash

# 本地快速部署脚本（可选）
# 适合直接在服务器上运行

set -e

echo "🚀 开始部署..."

# 进入项目目录
cd "$(dirname "$0")/.."

# 拉取最新代码
if [ -d ".git" ]; then
    echo "📥 拉取最新代码..."
    git pull origin main
fi

# 安装依赖
echo "📦 安装依赖..."
pnpm install --frozen-lockfile

# 构建项目
echo "🔨 构建项目..."
pnpm build

# 准备部署文件
echo "📋 准备部署文件..."
mkdir -p .next/standalone/logs
cp -r public .next/standalone/ 2>/dev/null || true
cp -r .next/static .next/standalone/.next/ 2>/dev/null || true
cp ecosystem.config.js .next/standalone/ 2>/dev/null || true

# 重启 PM2
echo "🔄 重启应用..."
cd .next/standalone
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save

echo "✅ 部署完成！"
echo ""
pm2 list

