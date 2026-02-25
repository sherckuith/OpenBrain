#!/bin/bash
# OpenBrain Start Script

# 1. Start Prisma Studio (Optional, for DB management)
# npx prisma studio &

# 2. Start Log Parser in background
echo "Starting Log Parser..."
ts-node scripts/log-parser.ts &
PARSER_PID=$!

# 3. Start Next.js App
echo "Starting Next.js App..."
npm run dev -- -H 0.0.0.0 -p 3000

# Cleanup on exit
kill $PARSER_PID
