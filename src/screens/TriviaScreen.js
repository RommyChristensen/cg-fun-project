import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import '../styles/TriviaScreen.css';

const TriviaScreen = () => {
  const {
    gameState,
    currentUser,
    room,
    nextQuestion,
    previousQuestion,
    completeChallengeQuestion,
    finishGame,
  } = useContext(AppContext);


  if (!gameState || !gameState.questions || gameState.questions.length === 0) {
    return <div className="screen">Loading...</div>;
  }

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  const isChallenge = currentQuestion.type === 'challenge';
  const isChallengeCompleted = gameState.completedChallenges.has(currentQuestion.id);
  const isMaster = room && currentUser === room.master;
  const isLastQuestion = gameState.currentQuestionIndex === gameState.questions.length - 1;

  const handleNext = () => {
    if (isChallenge && !isChallengeCompleted) {
      return;
    }
    if (isLastQuestion) {
      finishGame();
    } else {
      nextQuestion();
    }
  };

  const handleCompleteChallenge = () => {
    completeChallengeQuestion(currentQuestion.id);
  };

  return (
    <div className="screen">
      <div className="trivia-header">
        <div className="progress-info">
          Question {gameState.currentQuestionIndex + 1} / {gameState.questions.length}
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((gameState.currentQuestionIndex + 1) / gameState.questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="screen-content trivia-content">
        <div className={`question-card ${isChallenge ? 'challenge-card' : 'question-card-type'}`}>
          <div className="card-header">
            <span className={`badge ${isChallenge ? 'badge-challenge' : 'badge-question'}`}>
              {isChallenge ? '🎯 Challenge' : '❓ Question'}
            </span>
            <span className="badge badge-category">{currentQuestion.category}</span>
          </div>

          <div className="card-body">
            <p className="question-text">{currentQuestion.question}</p>
          </div>

          {isChallenge && (
            <div className="challenge-section">
              {!isChallengeCompleted ? (
                <div className="challenge-prompt">
                  <p>Complete this challenge to continue!</p>
                  {isMaster && (
                    <button className="btn btn-primary btn-block" onClick={handleCompleteChallenge}>
                      <Check size={18} />
                      Challenge Completed
                    </button>
                  )}
                  {!isMaster && (
                    <p className="waiting-text">Waiting for room master to confirm...</p>
                  )}
                </div>
              ) : (
                <div className="challenge-completed">
                  <div className="checkmark">✓</div>
                  <p>Challenge Completed!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card-info">
          <p>All players can see this card</p>
        </div>
      </div>

      {isMaster && (
        <div className="screen-footer trivia-footer">
          <button
            className="btn btn-secondary btn-small"
            onClick={previousQuestion}
            disabled={gameState.currentQuestionIndex === 0}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <button className="btn btn-primary" onClick={handleNext} disabled={isChallenge && !isChallengeCompleted}>
            {isLastQuestion ? 'Finish' : 'Next'}
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {!isMaster && (
        <div className="screen-footer">
          <p className="waiting-text">Waiting for room master to navigate...</p>
        </div>
      )}
    </div>
  );
};

export default TriviaScreen;
