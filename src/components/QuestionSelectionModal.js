import React, { useState } from 'react';
import '../styles/QuestionSelectionModal.css';

const QuestionSelectionModal = ({ onConfirm, onCancel }) => {
  const [questionCount, setQuestionCount] = useState(10);

  const handleConfirm = () => {
    if (questionCount >= 1 && questionCount <= 25) {
      onConfirm(questionCount);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 1 && value <= 25) {
      setQuestionCount(value);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Number of Questions</h2>
        <p className="modal-description">
          Choose how many questions you want (1-25). Approximately 10% will be challenges.
        </p>

        <div className="input-group modal-input">
          <label>Number of Questions:</label>
          <input
            type="number"
            min="1"
            max="25"
            value={questionCount}
            onChange={handleInputChange}
          />
          <div className="input-hint">
            {questionCount} questions (~{Math.round(questionCount * 0.1)} challenges)
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn btn-primary btn-block" onClick={handleConfirm}>
            Start Game
          </button>
          <button className="btn btn-secondary btn-block" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionSelectionModal;
