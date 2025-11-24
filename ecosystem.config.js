module.exports = {
  apps: [
    {
      name: 'tutorbuddy.co',
      script: '.next/standalone/server.js',
      cwd: '.',
      interpreter: 'node',
      instances: 1,
      autorestart: false,
      watch: false,
      max_memory_restart: '1G',
      max_restarts: 5,
      restart_delay: 5000,       // 5 seconds delay
      exp_backoff_restart_delay: 200, // exponential backoff
      stop_exit_codes: '0',
      env: {
        NODE_ENV: 'production',
        PORT: 3004
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3004
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
}; 