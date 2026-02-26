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

      // ---- SAFETY: SINGLE INSTANCE, NO CLUSTER ----
      instances: 1,
      exec_mode: 'fork',

      // ---- MEMORY: HARD CAP (prevents runaway memory / CPU from GC thrashing) ----
      max_memory_restart: '768M',

      // ---- RESTART: LIMIT LOOPS (prevents PM2 from eating CPU in restart storms) ----
      autorestart: true,
      max_restarts: 10,              // stop restarting after 10 rapid restarts
      min_uptime: '60s',             // only count as "crashed" if exit before 60s
      restart_delay: 15000,          // 15s between restart attempts (reduces CPU thrashing)
      exp_backoff_restart_delay: 1000,
      stop_exit_codes: '0',

      // ---- OPTIONAL: DAILY RESTART (clears leaks / runaway state at low traffic) ----
      //cron_restart: '0 4 * * *',    // 4:00 AM every day (disable if not wanted)

      // ---- ENV ----
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
        NODE_OPTIONS: '--max-old-space-size=704'  // V8 heap cap (child process inherits; keeps total under 768M)
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