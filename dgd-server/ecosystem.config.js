module.exports = {
  apps: [{
    name: 'juliang-server',
    script: 'src/app.js',
    cwd: '/www/juliangketang/dgd-server',
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    env: {
      NODE_ENV: 'production',
    },
    error_file: '/www/juliangketang/dgd-server/logs/error.log',
    out_file: '/www/juliangketang/dgd-server/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }],
};
