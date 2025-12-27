#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BLOG_BRANCH = 'public/blogs';
const BLOG_DIR = path.join(process.cwd(), 'public', 'blogs');

const colors = {
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
  } catch (error) {
    if (options.ignoreError) {
      return null;
    }
    throw error;
  }
}

function main() {
  log('📥 同步文章内容...', 'cyan');

  // 获取远程仓库 URL
  let remoteUrl;
  try {
    remoteUrl = exec('git config --get remote.origin.url', {
      silent: true,
    })?.trim();
    if (!remoteUrl) {
      log('❌ 无法获取远程仓库 URL', 'red');
      process.exit(1);
    }
  } catch {
    log('❌ Git 配置错误', 'red');
    process.exit(1);
  }

  // 检查目录是否已存在且是 git 仓库
  const gitDir = path.join(BLOG_DIR, '.git');
  if (fs.existsSync(gitDir)) {
    log('🔄 更新现有文章内容...', 'yellow');
    process.chdir(BLOG_DIR);
    exec(`git fetch origin ${BLOG_BRANCH}`);
    exec(`git reset --hard origin/${BLOG_BRANCH}`);
    log('✅ 文章内容已更新', 'green');
    process.exit(0);
  }

  // 如果目录存在但不是 git 仓库
  if (fs.existsSync(BLOG_DIR)) {
    log('⚠️  删除现有非 git 目录...', 'yellow');
    fs.rmSync(BLOG_DIR, { recursive: true, force: true });
  }

  // 克隆 public/blogs 分支
  log('📦 克隆文章内容分支...', 'yellow');
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    exec(`git clone --depth=1 --single-branch --branch ${BLOG_BRANCH} ${remoteUrl} ${BLOG_DIR}`);
    log('✅ 文章内容同步完成', 'green');
  } catch {
    log('❌ 克隆失败', 'red');
    process.exit(1);
  }
}

main();
