module.exports = {
  apps: [
    {
      name: 'tutorbuddy.co',
      
      // ---- WORKING DIRECTORY ----
      cwd: '/home/ubuntu/htdocs/tutorbuddy',
      
      // ---- START USING PNPM (IMPORTANT) ----
      script: '/home/ubuntu/.local/share/pnpm/pnpm',
      args: 'start',
      interpreter: 'sh',
      
      // ---- ABSOLUTE SAFETY ----
      instances: 1,          // NEVER > 1
      exec_mode: 'fork',     // NEVER cluster
      
      // ---- RESTART CONTROL ----
      autorestart: false,
      max_restarts: 5,
      restart_delay: 5000,       // 5 seconds delay
      exp_backoff_restart_delay: 200, // exponential backoff
      stop_exit_codes: '0',
      
      // ---- HARD MEMORY LIMIT ----
      max_memory_restart: '1G',
      
      // ---- ENV ----
      env: {
        NODE_ENV: 'production',
        PORT: 3004
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3004
      },
      
      // ---- LOGGING (LOCAL, ROTATABLE) ----
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      
      // ---- SHUTDOWN SAFETY ----
      kill_timeout: 5000,
      listen_timeout: 30000,
      wait_ready: false,
      watch: false
    }
  ]
}; 