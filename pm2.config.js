module.exports = {
  apps: [
    {
      name: "app",
      script: "src/app.js",
      watch: false,
      env: {
        "NODE_ENV": "development",
      },
      env_production: {
        "NODE_ENV": "production"
      },
      output: './logs/out.log',
      error: './logs/error.log',
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      combine_logs: true,
      time: true
    },
    {
      name: "cleanup",
      script: "cron/cleanup.js",
      cron_restart: "0 5 * * *",
      autorestart: false
    }
  ]
}