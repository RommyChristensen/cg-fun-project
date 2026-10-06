# CG FUN Companion App - Testing Guide

## Setup

### 1. Install Dependencies

```bash
cd /Users/rommy/cg-fun-project

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Start the Application

**Option A: Using the startup script (Recommended)**
```bash
chmod +x start.sh
./start.sh
```

**Option B: Manual startup**

Terminal 1 (Backend):
```bash
cd server
npm start
```

Terminal 2 (Frontend):
```bash
npm start
```

Wait for both to start:
- Backend: "Server running on port 3001"
- Frontend: App opens at http://localhost:3000

---

## Test Scenarios

### Test 1: Create Room & Join Room (Multiplayer Sync)

**Goal**: Verify that when one player joins, the other player's screen updates in real-time.

**Steps**:

1. **Browser Tab 1 (Player 1 - Master)**
   - Go to http://localhost:3000
   - Click "Create Room"
   - Enter Room Name: "Test Room"
   - Enter Your Name: "Alice"
   - Click "Create Room"
   - **Note the Room ID displayed** (e.g., "abc123def")
   - You should see:
     - Room name: "Test Room"
     - Room ID displayed
     - Players list showing only "Alice" with 👑 crown

2. **Browser Tab 2 (Player 2)**
   - Go to http://localhost:3000
   - Click "Join Room"
   - Enter Room ID: (paste from Tab 1)
   - Enter Your Name: "Bob"
   - Click "Join Room"

3. **Verify Real-time Sync**
   - **Tab 2**: Should show room lobby with both players
   - **Tab 1**: Should automatically update to show both "Alice" (👑) and "Bob"
   - Both tabs should show "Players (2)"

✅ **Expected Result**: Both players appear in both tabs immediately

---

### Test 2: Play Trivia Game (Master Control)

**Goal**: Verify that only the master can navigate, and all players see the same card.

**Prerequisites**: Complete Test 1 first

**Steps**:

1. **Tab 1 (Master - Alice)**
   - Click "Play Trivia"
   - A question card appears with:
     - Badge showing "❓ Question" or "🎯 Challenge"
     - Category badge
     - Question text
     - Progress bar (e.g., "Question 1 / 10")
   - You see "Previous" and "Next" buttons at the bottom

2. **Tab 2 (Player - Bob)**
   - Should automatically see the same card as Alice
   - Should see message "Waiting for room master to navigate..."
   - Should NOT see navigation buttons

3. **Navigate Questions (Tab 1)**
   - Click "Next" button
   - Progress bar updates to "Question 2 / 10"
   - **Tab 2**: Should automatically update to show the same question

4. **Test Previous Button**
   - Click "Previous" button
   - Goes back to Question 1
   - **Tab 2**: Updates automatically

✅ **Expected Result**: Both players always see the same card, only master can navigate

---

### Test 3: Challenge Completion

**Goal**: Verify that challenges must be completed before moving forward.

**Prerequisites**: Complete Test 1 & 2, navigate until you find a challenge

**Steps**:

1. **Tab 1 (Master - Alice)**
   - When you see a 🎯 Challenge card
   - Try clicking "Next" button
   - **Nothing happens** - button should be disabled or not work

2. **Complete the Challenge**
   - Click "Challenge Completed" button
   - Button changes to show ✓ (checkmark)
   - Card shows "Challenge Completed!" message

3. **Now Navigate**
   - Click "Next" button
   - Moves to next question
   - **Tab 2**: Updates automatically

4. **Tab 2 (Player - Bob)**
   - Sees the same challenge
   - Sees message "Waiting for room master to confirm..."
   - When Alice completes it, automatically sees the checkmark

✅ **Expected Result**: Challenges block progression until confirmed

---

### Test 4: Success Screen & Play Again

**Goal**: Verify success screen appears and can play again.

**Prerequisites**: Complete Test 3, finish all 10 questions

**Steps**:

1. **Tab 1 (Master - Alice)**
   - After Question 10, click "Next"
   - Success screen appears with:
     - 🏆 Trophy emoji (bouncing)
     - "Congratulations!" message
     - Confetti animation
     - Stats showing "10" questions answered
     - "Play Again" button

2. **Click "Play Again"**
   - New set of 10 random questions loads
   - Progress bar resets to "Question 1 / 10"
   - Different questions appear (randomized)

3. **Tab 2 (Player - Bob)**
   - Automatically sees success screen
   - Can see "Play Again" button but cannot click it
   - When Alice clicks "Play Again", automatically transitions to new game

✅ **Expected Result**: Success screen works, can replay infinite times

---

### Test 5: CG FUN Moments

**Goal**: Verify photo collage feature works in real-time.

**Prerequisites**: Be in a room (Test 1)

**Steps**:

1. **Tab 1 (Master - Alice)**
   - From Room Lobby, click "Moments" button
   - Empty state shows "No moments yet!"
   - Click "Add Moment"
   - Enter Photo URL: `https://via.placeholder.com/300?text=Moment+1`
   - Click "Add Moment"
   - Photo appears in 2-column grid

2. **Tab 2 (Player - Bob)**
   - Click "Moments" button
   - Should automatically see the photo Alice added
   - Click "Add Moment"
   - Enter Photo URL: `https://via.placeholder.com/300?text=Moment+2`
   - Click "Add Moment"

3. **Tab 1 (Master - Alice)**
   - Should automatically see Bob's photo
   - Now shows 2 photos in grid

4. **Add More Photos**
   - Add a 3rd and 4th photo
   - Grid should show 2 columns
   - Photos should be responsive

✅ **Expected Result**: Photos sync in real-time between players

---

### Test 6: Disconnect & Reconnect

**Goal**: Verify app handles disconnections gracefully.

**Prerequisites**: Be in a room with 2 players

**Steps**:

1. **Tab 1 (Master - Alice)**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Check "Offline" checkbox
   - App should show connection lost indicator
   - Uncheck "Offline"
   - App should reconnect automatically

2. **Tab 2 (Player - Bob)**
   - Same test as above

✅ **Expected Result**: App reconnects automatically without losing state

---

## Sample Photo URLs for Testing

```
https://via.placeholder.com/300?text=CG+FUN+1
https://via.placeholder.com/300?text=CG+FUN+2
https://via.placeholder.com/300?text=CG+FUN+3
https://picsum.photos/300/300?random=1
https://picsum.photos/300/300?random=2
```

---

## Troubleshooting

### Backend not starting
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill the process using port 3001
kill -9 <PID>

# Try starting again
cd server
npm start
```

### Frontend not connecting to backend
- Check browser console (F12 → Console)
- Look for Socket.io connection errors
- Verify backend is running on port 3001
- Check REACT_APP_SOCKET_URL in .env

### Players not syncing
- Check Network tab in DevTools
- Look for WebSocket connection (should be green)
- Check browser console for errors
- Verify both players are in the same room ID

### Port 3000 already in use
```bash
npm start -- --port 3002
```

---

## Success Checklist

- [ ] Two players can create and join a room
- [ ] Player list updates in real-time
- [ ] Only master can navigate questions
- [ ] Both players see the same card
- [ ] Challenges require confirmation before moving on
- [ ] Success screen appears after 10 questions
- [ ] Can play infinite games
- [ ] Photos sync in real-time
- [ ] App handles disconnections gracefully
- [ ] Mobile responsive design works

---

## Notes

- The backend stores rooms in memory (not persistent)
- Rooms are cleared when the server restarts
- Photos are stored in memory per room
- For production, use a database (MongoDB, PostgreSQL, etc.)
