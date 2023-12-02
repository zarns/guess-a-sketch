// client/components/GuessingPage.tsx

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useRouter } from 'next/router';
import { useSocket } from '../contexts/SocketContext';

interface GuessingPageProps {
  roomId: string | string[] | undefined;
  drawingToGuess: string;
  onViewDrawings: () => void;
}

const GuessingPage: React.FC<GuessingPageProps> = ({ roomId, drawingToGuess, onViewDrawings }) => {
  const socket = useSocket();
  const [guess, setGuess] = useState('');
  const [timer, setTimer] = useState(5);
  const [waitingForFlipbook, setWaitingForFlipbook] = useState(false);

  const handleSubmitGuess = () => {
    if (socket) {
      socket.emit('saveGuess', { roomId, guess });
      setWaitingForFlipbook(true);
      socket.emit('requestNextFlipbook', { roomId });
    }
    
    console.log('Guess submitted:', guess);
  };
  const handleViewAllDrawings = () => {
    if (socket) {
      socket.emit('viewAllDrawings', roomId);
      onViewDrawings(); // Call the onViewDrawings prop function
    }
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      handleSubmitGuess();
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    if (socket) {
      // Add listener for 'viewAllDrawings' event
      socket.on('viewAllDrawings', () => {
        handleViewAllDrawings(); // Fetch and display drawings when the event is received
      });
  
      // Clean up the listener when the component is unmounted
      return () => {
        socket.off('viewAllDrawings');
      };
    }
  }, [socket]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginTop: '.5rem',
            marginBottom: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            backgroundImage: 'linear-gradient(to top, rgba(0, 0, 60, 0.7), rgba(20, 20, 200, 0.9))',
            transition: 'background-color 0.3s',
          }}
        >
          Room {roomId}
        </h1>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginTop: '.5rem',
            marginBottom: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            backgroundColor: timer < 10 ? 'red' : 'blue',
            transition: 'background-color 0.3s',
          }}
        >
          Timer: {timer} Seconds
        </h2>
      </div>
      <div className="guessing-page">
        <div className="prompt-box">
          What do you think this drawing represents?
        </div>
        <img src={drawingToGuess} alt="Drawing to guess" style={{ border: '1px solid black' }} />
        <br></br>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type your guess here..."
          style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}
        />
        <button
          onClick={handleSubmitGuess}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
        <button
          onClick={handleViewAllDrawings}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          View Drawings
        </button>
      </div>
      {waitingForFlipbook && (
        <div 
          className={"text-black font-bold py-2 px-4 rounded"} 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '1rem', 
            fontSize: '25px'  // or any other value you prefer
          }}
        >
          Submitted. Waiting for next flipbook to become available...
        </div>

      )}
    </div>
  );
};

export default GuessingPage;
