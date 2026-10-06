require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});
const io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://cg-fun-companion.netlify.app',
      'https://cg-fun-project.onrender.com',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(uploadDir));

const rooms = new Map();
const globalMoments = [];

app.post('/upload', (req, res) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const photoUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    console.log('File uploaded successfully:', req.file.filename);
    res.json({ photoUrl, filename: req.file.filename });
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/moments', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const moments = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      })
      .map((file) => ({
        id: file,
        photoUrl: `http://localhost:3001/uploads/${file}`,
        filename: file,
      }));

    console.log('Returning moments:', moments.length);
    res.json(moments);
  } catch (error) {
    console.error('Error reading uploads:', error);
    res.status(500).json({ error: 'Failed to fetch moments' });
  }
});

app.get('/api/sessions', (req, res) => {
  try {
    const sessions = [];
    rooms.forEach((room, roomId) => {
      sessions.push({
        id: roomId,
        name: room.name,
        master: room.master,
        playerCount: room.players.length,
        players: room.players,
        status: room.gameState ? 'playing' : 'waiting',
      });
    });

    console.log('Returning sessions:', sessions.length);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('create_room', (data) => {
    const { roomName, userName } = data;
    const roomId = Math.random().toString(36).substr(2, 9);

    const room = {
      id: roomId,
      name: roomName,
      master: userName,
      masterSocketId: socket.id,
      players: [userName],
      createdAt: new Date(),
      gameState: null,
    };

    rooms.set(roomId, room);
    socket.join(roomId);
    socket.emit('room_created', { room, socketId: socket.id });
    io.to(roomId).emit('room_updated', room);

    console.log(`Room created: ${roomId} by ${userName}`);
  });

  socket.on('join_room', (data) => {
    const { roomId, userName } = data;
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (!room.players.includes(userName)) {
      room.players.push(userName);
    }

    socket.join(roomId);
    socket.emit('room_joined', { room, socketId: socket.id });
    io.to(roomId).emit('room_updated', room);

    console.log(`${userName} joined room: ${roomId}`);
  });

  socket.on('start_trivia', (data) => {
    const { roomId, questions } = data;
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    room.gameState = {
      game: 'trivia',
      questions: questions,
      currentQuestionIndex: 0,
      completedChallenges: new Set(),
    };

    io.to(roomId).emit('game_started', {
      gameState: {
        ...room.gameState,
        completedChallenges: Array.from(room.gameState.completedChallenges),
      },
    });

    console.log(`Trivia started in room: ${roomId}`);
  });

  socket.on('next_question', (data) => {
    const { roomId } = data;
    const room = rooms.get(roomId);

    if (!room || !room.gameState) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    room.gameState.currentQuestionIndex += 1;

    io.to(roomId).emit('question_updated', {
      currentQuestionIndex: room.gameState.currentQuestionIndex,
    });
  });

  socket.on('previous_question', (data) => {
    const { roomId } = data;
    const room = rooms.get(roomId);

    if (!room || !room.gameState) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    room.gameState.currentQuestionIndex = Math.max(
      0,
      room.gameState.currentQuestionIndex - 1
    );

    io.to(roomId).emit('question_updated', {
      currentQuestionIndex: room.gameState.currentQuestionIndex,
    });
  });

  socket.on('complete_challenge', (data) => {
    const { roomId, questionId } = data;
    const room = rooms.get(roomId);

    if (!room || !room.gameState) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    room.gameState.completedChallenges.add(questionId);

    io.to(roomId).emit('challenge_completed', {
      questionId,
      completedChallenges: Array.from(room.gameState.completedChallenges),
    });
  });

  socket.on('finish_game', (data) => {
    const { roomId } = data;
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    room.gameState = null;
    io.to(roomId).emit('game_finished', {});

    console.log(`Game finished in room: ${roomId}`);
  });

  socket.on('add_moment', (data) => {
    const { roomId, photoUrl } = data;

    const moment = {
      id: uuidv4(),
      photoUrl,
      timestamp: new Date(),
    };

    if (roomId) {
      const room = rooms.get(roomId);
      if (room) {
        if (!room.moments) {
          room.moments = [];
        }
        room.moments.push(moment);
        io.to(roomId).emit('moment_added', moment);
        console.log(`Moment added to room: ${roomId}`);
      }
    }

    globalMoments.push(moment);
    io.emit('moment_added_global', moment);
    console.log(`Moment added globally. Total: ${globalMoments.length}`);
  });

  socket.on('get_moments', (data) => {
    const { roomId } = data;
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    console.log('Fetching moments for room:', roomId, 'Count:', room.moments?.length || 0);
    socket.emit('moments_list', room.moments || []);
  });

  socket.on('get_all_moments', (data) => {
    console.log('Getting all moments');
    console.log('Global moments:', globalMoments.length);
    socket.emit('all_moments_list', globalMoments);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    let masterRoomId = null;
    rooms.forEach((room, roomId) => {
      if (room.masterSocketId === socket.id) {
        masterRoomId = roomId;
      }
    });

    if (masterRoomId) {
      const room = rooms.get(masterRoomId);
      console.log(`Room master disconnected. Removing room: ${masterRoomId} (${room.name})`);
      io.to(masterRoomId).emit('room_closed', { message: 'Room master has left. Room is closing.' });
      rooms.delete(masterRoomId);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
