/**
 * PM2 Ecosystem Configuration
 *
 * این فایل برای مدیریت Next.js با PM2 استفاده می‌شود
 * PM2 به صورت خودکار اپلیکیشن را restart می‌کند در صورت خطا یا ریستارت سرور
 */

module.exports = {
  apps: [
    {
      name: 'cartable-ui',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 10000,
      kill_timeout: 5000,
      wait_ready: true,
      restart_delay: 4000,
    },
  ],
};
