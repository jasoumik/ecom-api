module.exports = {
  apps: [
    {
      name: 'rg-api',
      script: 'index.js',
      cwd: '/var/www/html/rg-ecom-api/.medusa/server',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 4001,
      },
      error_file: '/home/jasoumik/logs/rg-api-error.log',
      out_file: '/home/jasoumik/logs/rg-api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
