#!/bin/bash

# 服务器端部署脚本
# 自动检查环境、初始化并启动应用

# 尝试加载用户环境配置
[ -f "$HOME/.bashrc" ] && source "$HOME/.bashrc" 2>/dev/null || true
[ -f "$HOME/.profile" ] && source "$HOME/.profile" 2>/dev/null || true
[ -f "$HOME/.bash_profile" ] && source "$HOME/.bash_profile" 2>/dev/null || true

set -e

echo "🚀 开始部署 9yan.cn..."

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 检查 Node.js
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        echo "请安装 Node.js 20+: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js 版本过低 (需要 18+)${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
}

# 检查并安装 PM2
check_and_install_pm2() {
    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}📦 PM2 未安装，正在安装...${NC}"
        npm install -g pm2
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ PM2 安装成功${NC}"
        else
            echo -e "${RED}❌ PM2 安装失败，尝试使用 sudo${NC}"
            sudo npm install -g pm2
        fi
    else
        echo -e "${GREEN}✅ PM2 $(pm2 -v)${NC}"
    fi
}

# 配置 PM2 自动启动
setup_pm2_startup() {
    if ! pm2 startup | grep -q "already configured"; then
        echo -e "${YELLOW}⚙️  配置 PM2 开机自启...${NC}"
        pm2 startup | grep "sudo" | bash || true
    fi
}

# 创建必要目录
create_directories() {
    echo -e "${YELLOW}📁 创建目录结构...${NC}"
    mkdir -p logs
    mkdir -p .next/static
    echo -e "${GREEN}✅ 目录创建完成${NC}"
}

# 启动或重启应用
start_application() {
    echo -e "${YELLOW}🔄 启动应用...${NC}"
    
    # 检查应用是否已经在运行
    if pm2 describe 9yan.cn > /dev/null 2>&1; then
        echo "应用正在运行，执行重启..."
        pm2 restart ecosystem.config.js --update-env
    else
        echo "首次启动应用..."
        pm2 start ecosystem.config.js
    fi
    
    # 保存进程列表
    pm2 save
    
    echo -e "${GREEN}✅ 应用启动成功${NC}"
}

# 清理旧日志
cleanup_logs() {
    if [ -d "logs" ] && [ "$(du -s logs | cut -f1)" -gt 102400 ]; then
        echo -e "${YELLOW}🧹 清理旧日志文件...${NC}"
        find logs -name "*.log" -mtime +7 -delete
    fi
}

# 主流程
main() {
    echo "========================================"
    echo "       9yan.cn 部署脚本 v1.0"
    echo "========================================"
    echo ""
    
    # 环境检查
    echo "📋 检查环境..."
    check_node
    check_and_install_pm2
    
    # 配置 PM2
    setup_pm2_startup
    
    # 创建目录
    create_directories
    
    # 清理旧日志
    cleanup_logs
    
    # 启动应用
    start_application
    
    echo ""
    echo "========================================"
    echo -e "${GREEN}✨ 部署完成！${NC}"
    echo "========================================"
    echo ""
    echo "📊 应用状态："
    pm2 list
    echo ""
    echo "📝 查看日志: pm2 logs 9yan.cn"
    echo "📈 监控面板: pm2 monit"
    echo "🔄 重启应用: pm2 restart 9yan.cn"
}

# 执行主流程
main

