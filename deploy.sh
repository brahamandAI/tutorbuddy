#!/bin/bash
set -e

echo "🚀 Starting deployment process..."
npm install
npm run build
pm2 reload ecosystem.config.js