import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { RotateCcw, Home } from 'lucide-react';
import questionsData from '../data/questions.json';
import '../styles/SuccessScreen.css';

const SuccessScreen = () => {
  const { startTrivia, goHome, room, currentUser } = useContext(AppContext);

  const isMaster = room && currentUser === room.master;

  const handlePlayAgain = () => {
    const shuffledQuestions = questionsData
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    startTrivia(shuffledQuestions);
  };

  return (
    <div className="screen">
      <div className="success-container">
        <div className="success-animation">
          <div className="confetti">🎉</div>
          <div className="confetti">🎊</div>
          <div className="confetti">🎈</div>
          <div className="confetti">⭐</div>
          <div className="confetti">🌟</div>
        </div>

        <div className="success-content">
          <div className="trophy">🏆</div>
          <h1>Congratulations!</h1>
          <p className="success-message">You've completed CG FUN TRIVIA!</p>
          <p className="success-subtitle">Great bonding experience with your cell group!</p>

          <div className="stats">
            <div className="stat-item">
              <div className="stat-label">Questions Answered</div>
              <div className="stat-value">10</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Challenges Completed</div>
              <div className="stat-value">✓</div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          {isMaster && (
            <button className="btn btn-primary btn-block" onClick={handlePlayAgain}>
              <RotateCcw size={18} />
              Play Again
            </button>
          )}
          {!isMaster && (
            <p className="waiting-text">Waiting for room master to start a new game...</p>
          )}
          <button className="btn btn-secondary btn-block" onClick={goHome}>
            <Home size={18} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
