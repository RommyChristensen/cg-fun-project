import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const createRoom = (roomName, userName, callback) => {
  const socket = getSocket();
  socket.emit('create_room', { roomName, userName });
  socket.once('room_created', callback);
};

export const joinRoom = (roomId, userName, callback) => {
  const socket = getSocket();
  socket.emit('join_room', { roomId, userName });
  socket.once('room_joined', callback);
};

export const onRoomUpdated = (callback) => {
  const socket = getSocket();
  socket.on('room_updated', callback);
};

export const offRoomUpdated = (callback) => {
  const socket = getSocket();
  socket.off('room_updated', callback);
};

export const startTrivia = (roomId, questions) => {
  const socket = getSocket();
  socket.emit('start_trivia', { roomId, questions });
};

export const onGameStarted = (callback) => {
  const socket = getSocket();
  socket.on('game_started', callback);
};

export const offGameStarted = (callback) => {
  const socket = getSocket();
  socket.off('game_started', callback);
};

export const nextQuestion = (roomId) => {
  const socket = getSocket();
  socket.emit('next_question', { roomId });
};

export const previousQuestion = (roomId) => {
  const socket = getSocket();
  socket.emit('previous_question', { roomId });
};

export const onQuestionUpdated = (callback) => {
  const socket = getSocket();
  socket.on('question_updated', callback);
};

export const offQuestionUpdated = (callback) => {
  const socket = getSocket();
  socket.off('question_updated', callback);
};

export const completeChallenge = (roomId, questionId) => {
  const socket = getSocket();
  socket.emit('complete_challenge', { roomId, questionId });
};

export const onChallengeCompleted = (callback) => {
  const socket = getSocket();
  socket.on('challenge_completed', callback);
};

export const offChallengeCompleted = (callback) => {
  const socket = getSocket();
  socket.off('challenge_completed', callback);
};

export const finishGame = (roomId) => {
  const socket = getSocket();
  socket.emit('finish_game', { roomId });
};

export const onGameFinished = (callback) => {
  const socket = getSocket();
  socket.on('game_finished', callback);
};

export const offGameFinished = (callback) => {
  const socket = getSocket();
  socket.off('game_finished', callback);
};

export const addMoment = (roomId, photoUrl) => {
  const socket = getSocket();
  socket.emit('add_moment', { roomId, photoUrl });
};

export const onMomentAdded = (callback) => {
  const socket = getSocket();
  socket.on('moment_added', callback);
};

export const offMomentAdded = (callback) => {
  const socket = getSocket();
  socket.off('moment_added', callback);
};

export const onRoomClosed = (callback) => {
  const socket = getSocket();
  socket.on('room_closed', callback);
};

export const offRoomClosed = (callback) => {
  const socket = getSocket();
  socket.off('room_closed', callback);
};

export const getMoments = (roomId, callback) => {
  const socket = getSocket();
  socket.emit('get_moments', { roomId });
  socket.once('moments_list', callback);
};

export const getAllMoments = (callback) => {
  const socket = getSocket();
  socket.emit('get_all_moments', {});
  socket.once('all_moments_list', callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
