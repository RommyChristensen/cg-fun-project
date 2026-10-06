#!/bin/bash

echo "Starting CG FUN Companion App..."
echo ""

# Check if node_modules exists in root
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

# Check if node_modules exists in server
if [ ! -d "server/node_modules" ]; then
  echo "Installing server dependencies..."
  cd server
  npm install
  cd ..
fi

echo ""
echo "Starting backend server on port 5000..."
cd server
npm start &
SERVER_PID=$!

echo "Starting frontend on port 3000..."
cd ..
npm start &
FRONTEND_PID=$!

echo ""
echo "Both servers are running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

wait $SERVER_PID $FRONTEND_PID
