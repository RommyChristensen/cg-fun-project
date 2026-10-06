# Quick Start Guide

## 1. Install Dependencies (First Time Only)

```bash
cd /Users/rommy/cg-fun-project

# Install frontend
npm install

# Install backend
cd server
npm install
cd ..
```

## 2. Start the App

### Easiest Way (Recommended)
```bash
chmod +x start.sh
./start.sh
```

### Or Manually (Two Terminals)

**Terminal 1:**
```bash
cd /Users/rommy/cg-fun-project/server
npm start
```

**Terminal 2:**
```bash
cd /Users/rommy/cg-fun-project
npm start
```

## 3. Test It

1. Open http://localhost:3000 in **Browser Tab 1**
2. Open http://localhost:3000 in **Browser Tab 2** (or different browser)

**Tab 1 (Master):**
- Click "Create Room"
- Room Name: "Test"
- Your Name: "Alice"
- Click "Create Room"
- Note the Room ID

**Tab 2 (Player):**
- Click "Join Room"
- Room ID: (paste from Tab 1)
- Your Name: "Bob"
- Click "Join Room"

**Tab 1 (Master):**
- Should see both Alice and Bob in player list
- Click "Play Trivia"
- Navigate with Next/Previous buttons

**Tab 2 (Player):**
- Should see the same card as Tab 1
- Cannot click buttons (waiting for master)

## 4. What to Test

✅ Player list updates in real-time
✅ Both players see the same card
✅ Only master can navigate
✅ Challenges require confirmation
✅ Success screen appears after 10 questions
✅ Photos sync in real-time

## 5. Troubleshooting

**Port already in use?**
```bash
npm start -- --port 3001
```

**Backend not starting?**
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

**Not syncing?**
- Check browser console (F12)
- Verify both servers are running
- Check WebSocket connection in Network tab

## 6. Next Steps

- Read `TESTING_GUIDE.md` for detailed testing
- Read `IMPLEMENTATION_SUMMARY.md` for architecture details
- Check `README.md` for full documentation

---

**That's it! You're ready to test the multiplayer game! 🎮**
