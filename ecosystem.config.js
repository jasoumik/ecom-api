module.exports = {
  apps: [
    {
      name: 'ecom-api',
      script: '.medusa/server/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 9000,
      },
      error_file: '/home/deploy/logs/ecom-api-error.log',
      out_file: '/home/deploy/logs/ecom-api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
