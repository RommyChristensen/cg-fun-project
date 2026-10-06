# CG FUN Companion App

A mobile web application for church cell group activities. This app helps groups bond through interactive games and activities.

## Features

### Stage 1: CG FUN TRIVIA
- **Room System**: Create or join rooms for group activities
- **Question & Challenge System**: Mix of trivia questions and interactive challenges
- **Card-Based UI**: Beautiful card design optimized for mobile viewing
- **Master Control**: Room master navigates through questions while all players see the same card
- **Challenge Confirmation**: Room master confirms when challenges are completed
- **Success Screen**: Celebratory completion screen after finishing the game
- **CG FUN Moments**: Photo collage feature to capture and share group memories

## Tech Stack

### Frontend
- **React 18**: UI framework
- **Socket.io Client**: Real-time communication
- **Lucide React**: Icons
- **CSS3**: Styling with custom animations

### Backend
- **Node.js & Express**: Server framework
- **Socket.io**: Real-time bidirectional communication
- **CORS**: Cross-origin resource sharing

## Installation

### Frontend
```bash
npm install
```

### Backend
```bash
cd server
npm install
cd ..
```

## Running the App

### Option 1: Run Both Frontend and Backend Together (Recommended)

```bash
chmod +x start.sh
./start.sh
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend on `http://localhost:3000`

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm start
```

The app will open at `http://localhost:3000` and connect to backend on `http://localhost:3001`

## Project Structure

```
src/
├── screens/           # All screen components
│   ├── HomeScreen.js
│   ├── RoomLobbyScreen.js
│   ├── GameSelectionScreen.js
│   ├── TriviaScreen.js
│   ├── SuccessScreen.js
│   └── MomentsScreen.js
├── context/          # State management
│   └── AppContext.js
├── data/            # Static data
│   └── questions.json
├── styles/          # CSS files
└── App.js           # Main app component
```

## How to Play

1. **Create or Join a Room**: Enter your name and create a new room or join an existing one
2. **Wait for Players**: Room master waits for other players to join
3. **Start Trivia**: Room master clicks "Play Trivia" to begin
4. **Navigate Questions**: Room master uses Next/Previous buttons to navigate
5. **Complete Challenges**: When a challenge appears, room master confirms completion
6. **Finish Game**: After all questions, see the success screen
7. **Play Again**: Start a new game with randomized questions

## Color Palette

- Primary Teal: `#1db584`
- Primary Yellow: `#f4d35e`
- Primary Orange: `#ee964b`
- Primary Red: `#d64545`
- Dark Navy: `#2c3e50`

## Future Enhancements

- Backend integration for real-time synchronization
- More game types
- User authentication
- Leaderboards
- Photo upload to backend storage
- Multiplayer game modes

## License

MIT
