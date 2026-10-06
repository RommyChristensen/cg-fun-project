import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Play, Home, Image, Copy, Check } from 'lucide-react';
import questionsData from '../data/questions.json';
import QuestionSelectionModal from '../components/QuestionSelectionModal';
import { selectQuestionsWithChallenges } from '../utils/questionSelector';
import '../styles/RoomLobbyScreen.css';

const RoomLobbyScreen = () => {
  const { room, players, currentUser, startTrivia, goHome, goToMoments } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePlayTrivia = () => {
    setShowModal(true);
  };

  const handleConfirmQuestions = (count) => {
    const selectedQuestions = selectQuestionsWithChallenges(questionsData, count);
    startTrivia(selectedQuestions);
    setShowModal(false);
  };

  const handleCancelModal = () => {
    setShowModal(false);
  };

  const handleCopyRoomId = () => {
    if (room?.id) {
      navigator.clipboard.writeText(room.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isMaster = room && currentUser === room.master;

  return (
    <div className="screen">
      <div className="screen-header">
        <div>🎮 {room?.name}</div>
        <div className="room-id">ID: {room?.id}</div>
      </div>

      <div className="screen-content lobby-content">
        <div className="room-info">
          <h3>Room Master</h3>
          <div className="master-badge">👑 {room?.master}</div>
          <button className="btn-copy-room-id" onClick={handleCopyRoomId} title="Copy Room ID">
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy Room ID
              </>
            )}
          </button>
        </div>

        <div className="players-section">
          <h3>Players ({players.length})</h3>
          <ul className="players-list">
            {players.map((player, index) => (
              <li key={index} className={player === room?.master ? 'master' : ''}>
                {player}
              </li>
            ))}
          </ul>
        </div>

        <div className="instructions">
          <h4>Ready to Play?</h4>
          <p>
            {isMaster
              ? 'Click "Play Trivia" to start the game. You will navigate through questions and challenges.'
              : 'Waiting for the room master to start the game...'}
          </p>
        </div>
      </div>

      <div className="screen-footer">
        {isMaster && (
          <button className="btn btn-primary btn-block" onClick={handlePlayTrivia}>
            <Play size={18} />
            Play Trivia
          </button>
        )}
        <button className="btn btn-danger btn-small" onClick={goHome}>
          <Home size={18} />
          Home
        </button>
      </div>

      {showModal && (
        <QuestionSelectionModal
          onConfirm={handleConfirmQuestions}
          onCancel={handleCancelModal}
        />
      )}
    </div>
  );
};

export default RoomLobbyScreen;
