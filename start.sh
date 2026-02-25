#!/bin/bash
# OpenBrain Start Script

# Ensure sessions dir exists
SESSIONS_DIR="$HOME/.openclaw/sessions"
DOCS_DIR="$(pwd)/docs/projects"
mkdir -p "$SESSIONS_DIR"
mkdir -p "$DOCS_DIR"
mkdir -p logs

# Show My IP
if command -v hostname &> /dev/null; then
  IP_ADDRESS=$(hostname -I | awk '{print $1}')
else 
  IP_ADDRESS="localhost"
fi

echo "============================================"
echo " 🧠 OpenBrain - Starting Service "
echo "============================================"
echo " 📂 Watching Sessions: $SESSIONS_DIR"
echo " 📂 Watching Docs: $DOCS_DIR"
echo " 🌐 Web Interface: http://$IP_ADDRESS:3000"
echo "============================================"

# Start Parser
echo "Starting Log Parser..."
# Use tsx for better ESM support
npx tsx scripts/log-parser.ts > logs/parser.log 2>&1 &
PARSER_PID=$!

# Start Next.js
echo "Starting Next.js..."
npm run dev -- -H 0.0.0.0 -p 3000 &
NEXT_PID=$!

# Trap Ctrl+C to kill both
trap "kill $PARSER_PID $NEXT_PID; exit" SIGINT

# Wait for Next.js
wait $NEXT_PID
