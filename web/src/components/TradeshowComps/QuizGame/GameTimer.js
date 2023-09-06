import React, { useState } from 'react';
import Timer from './Timer'; // Adjust the import path

const GameTimer = () => {
  const [questionIndex, setQuestionIndex] = useState(0);

  const questions = [
    // Your quiz questions data
  ];

  const handleTimeExpired = () => {
    // Logic to handle when time expires
    // For example, move to the next question or end the game
  };

  return (
    <div>
      <h1>Quiz Game</h1>
      <Timer timeLimit={30} onTimeExpired={handleTimeExpired} />
      {/* Render your question and answer options */}
    </div>
  );
};

export default GameTimer;
