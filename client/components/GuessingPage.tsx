// client/components/GuessingPage.tsx

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useRouter } from 'next/router';
import { useSocket } from '../contexts/SocketContext';

interface GuessingPageProps {
  roomId: string | string[] | undefined;
  drawingToGuess: string; // The data URL of the drawing to guess
  onSubmit: () => void; // Callback to notify parent component when a guess is submitted
}

const GuessingPage: React.FC<GuessingPageProps> = ({ roomId, drawingToGuess, onSubmit }) => {
  const socket = useSocket();
  const [guess, setGuess] = useState('');

  const handleGuessSubmit = () => {
    if (socket && guess.trim()) {
      socket.emit('submitGuess', { roomId, guess });
      onSubmit(); // Notify parent component
    }
  };

  return (
    <div className="guessing-page">
      <h2>What do you think this drawing represents?</h2>
      <img src={drawingToGuess} alt="Drawing to guess" />
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Type your guess here..."
      />
      <button onClick={handleGuessSubmit}>Submit Guess</button>
    </div>
  );
};

export default GuessingPage;
