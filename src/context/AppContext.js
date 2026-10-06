import React, { createContext, useState, useCallback, useEffect } from 'react';
import {
  initSocket,
  createRoom as socketCreateRoom,
  joinRoom as socketJoinRoom,
  onRoomUpdated,
  offRoomUpdated,
  onGameStarted,
  offGameStarted,
  onQuestionUpdated,
  offQuestionUpdated,
  onChallengeCompleted,
  offChallengeCompleted,
  onGameFinished,
  offGameFinished,
  onMomentAdded,
  offMomentAdded,
  onRoomClosed,
  offRoomClosed,
  getMoments,
  getAllMoments,
  disconnectSocket,
} from '../services/socketService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [cgFunMoments, setCgFunMoments] = useState([]);

  useEffect(() => {
    initSocket();
  }, []);

  const createRoom = useCallback((roomName, userName) => {
    socketCreateRoom(roomName, userName, (data) => {
      setRoom(data.room);
      setCurrentUser(userName);
      setPlayers(data.room.players);
      setCurrentScreen('roomLobby');
    });
  }, []);

  const joinRoom = useCallback((roomId, userName) => {
    socketJoinRoom(roomId, userName, (data) => {
      setRoom(data.room);
      setCurrentUser(userName);
      setPlayers(data.room.players);
      setCurrentScreen('roomLobby');
    });
  }, []);

  useEffect(() => {
    const handleRoomUpdated = (updatedRoom) => {
      setRoom(updatedRoom);
      setPlayers(updatedRoom.players);
    };

    const handleGameStarted = (data) => {
      setGameState({
        game: 'trivia',
        questions: data.gameState.questions,
        currentQuestionIndex: data.gameState.currentQuestionIndex,
        completedChallenges: new Set(data.gameState.completedChallenges),
      });
      setCurrentScreen('trivia');
    };

    const handleQuestionUpdated = (data) => {
      setGameState((prev) => ({
        ...prev,
        currentQuestionIndex: data.currentQuestionIndex,
      }));
    };

    const handleChallengeCompleted = (data) => {
      setGameState((prev) => ({
        ...prev,
        completedChallenges: new Set(data.completedChallenges),
      }));
    };

    const handleGameFinished = () => {
      setCurrentScreen('success');
      setGameState(null);
    };

    const handleRoomClosed = (data) => {
      console.log('Room closed:', data.message);
      setRoom(null);
      setPlayers([]);
      setGameState(null);
      setCurrentScreen('home');
    };

    const handleMomentAdded = (moment) => {
      setCgFunMoments((prev) => [...prev, moment]);
    };

    onRoomUpdated(handleRoomUpdated);
    onGameStarted(handleGameStarted);
    onQuestionUpdated(handleQuestionUpdated);
    onChallengeCompleted(handleChallengeCompleted);
    onGameFinished(handleGameFinished);
    onMomentAdded(handleMomentAdded);
    onRoomClosed(handleRoomClosed);

    return () => {
      offRoomUpdated(handleRoomUpdated);
      offGameStarted(handleGameStarted);
      offQuestionUpdated(handleQuestionUpdated);
      offChallengeCompleted(handleChallengeCompleted);
      offGameFinished(handleGameFinished);
      offMomentAdded(handleMomentAdded);
      offRoomClosed(handleRoomClosed);
    };
  }, []);

  const startTrivia = useCallback((questions) => {
    if (room) {
      const { startTrivia: socketStartTrivia } = require('../services/socketService');
      socketStartTrivia(room.id, questions);
    }
  }, [room]);

  const nextQuestion = useCallback(() => {
    if (room) {
      const { nextQuestion: socketNextQuestion } = require('../services/socketService');
      socketNextQuestion(room.id);
    }
  }, [room]);

  const previousQuestion = useCallback(() => {
    if (room) {
      const { previousQuestion: socketPreviousQuestion } = require('../services/socketService');
      socketPreviousQuestion(room.id);
    }
  }, [room]);

  const completeChallengeQuestion = useCallback((questionId) => {
    if (room) {
      const { completeChallenge } = require('../services/socketService');
      completeChallenge(room.id, questionId);
    }
  }, [room]);

  const finishGame = useCallback(() => {
    if (room) {
      const { finishGame: socketFinishGame } = require('../services/socketService');
      socketFinishGame(room.id);
    }
  }, [room]);

  const goToMoments = useCallback(() => {
    setCurrentScreen('moments');
    getAllMoments((moments) => {
      console.log('Fetched moments:', moments);
      setCgFunMoments(moments);
    });
  }, []);

  const addMoment = useCallback((photoUrl) => {
    if (room) {
      const { addMoment: socketAddMoment } = require('../services/socketService');
      socketAddMoment(room.id, photoUrl);
    }
  }, [room]);

  const goHome = useCallback(() => {
    setCurrentScreen('home');
    setRoom(null);
    setPlayers([]);
    setCurrentUser(null);
    setGameState(null);
    setCgFunMoments([]);
    disconnectSocket();
  }, []);

  const value = {
    currentScreen,
    setCurrentScreen,
    room,
    players,
    currentUser,
    gameState,
    cgFunMoments,
    createRoom,
    joinRoom,
    startTrivia,
    nextQuestion,
    previousQuestion,
    completeChallengeQuestion,
    finishGame,
    goToMoments,
    addMoment,
    goHome,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
