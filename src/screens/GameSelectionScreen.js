import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/GameSelectionScreen.css';

const GameSelectionScreen = () => {
  const { setCurrentScreen } = useContext(AppContext);

  return (
    <div className="screen">
      <div className="screen-header">🎮 Select a Game</div>

      <div className="screen-content game-selection-content">
        <div className="game-card">
          <div className="game-icon">🧠</div>
          <h3>CG FUN TRIVIA</h3>
          <p>Answer questions and complete challenges with your group!</p>
          <button
            className="btn btn-primary btn-block"
            onClick={() => setCurrentScreen('trivia')}
          >
            Play Now
          </button>
        </div>

        <div className="coming-soon">
          <p>More games coming soon...</p>
        </div>
      </div>

      <div className="screen-footer">
        <button className="btn btn-secondary btn-block" onClick={() => setCurrentScreen('roomLobby')}>
          Back to Lobby
        </button>
      </div>
    </div>
  );
};

export default GameSelectionScreen;
