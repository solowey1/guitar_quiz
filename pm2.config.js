module.exports = {
  apps: [{
    name: "app",
    script: "src/app.js",
    watch: true,
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production"
    },
    output: './logs/out.log',
    error: './logs/error.log',
    log: './logs/combined.log',
    time: true
  }]
}