module.exports = {
  apps: [
    {
      name: '9yan.cn',
      script: 'server.js',
      cwd: './',
      instances: 1,
      exec_mode: 'cluster',

      // 环境变量
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: 1,
      },

      // 日志配置
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // 进程管理
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 3000,

      // 资源限制
      max_memory_restart: '500M',

      // 监控和健康检查
      watch: false,
      listen_timeout: 10000,
      kill_timeout: 5000,

      // 实例配置
      wait_ready: true,

      // 日志轮转（可选，需要 pm2-logrotate）
      // 使用 pm2 install pm2-logrotate 安装
    },
  ],

  // 部署配置（可选）
  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOST',
      ref: 'origin/main',
      repo: 'GIT_REPOSITORY',
      path: 'DEPLOY_PATH',
      'post-deploy':
        'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
