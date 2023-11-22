// client/pages/[roomId].tsx

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Lobby from '../components/Lobby'
import DrawingPage from '../components/DrawingPage';
import DisplayDrawingsPage from '../components/DisplayDrawingsPage';
import GuessingPage from '../components/GuessingPage';
import { useSocket } from '../contexts/SocketContext';

interface FlipBookPage {
  username: string;
  type: 'drawing' | 'guess';
  content: string;
}

const Room: React.FC = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const [gameStarted, setGameStarted] = useState(false);
  const [showDrawings, setShowDrawings] = useState(false);
  const socket = useSocket();
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [previousWord, setPreviousWord] = useState<string | null>(null);
  const [previousDrawing, setPreviousDrawing] = useState<string | null>(null);
  const [previousAuthor, setPreviousAuthor] = useState<string | null>(null);

  useEffect(() => {
    console.log(`Current Round: ${currentRound}`);
  }, [currentRound]);

  const handleGameStarted = () => {
    setCurrentRound(1);
    setGameStarted(true);
  };

  const handleShowDrawings = () => {
    console.log("delete_this")
    setShowDrawings(true);
  };

  useEffect(() => {
    if (socket) {
      socket.on('gameStarted', handleGameStarted);
      return () => {
        socket.off('gameStarted', handleGameStarted);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('flipbookData', (latestPage: FlipBookPage) => {
        const { type, username, content } = latestPage;
        console.log(`Type: ${type}, Username: ${username}, Content: ${content}`);     

        setPreviousAuthor(username);
        if (type === 'guess') {
          setPreviousWord(content);
        } else {
          setPreviousDrawing(content);
        }
      });
      socket.on('nextRound', (newCurrentRound) => {
        setCurrentRound(newCurrentRound);
      });
      socket.on('endGame', () => {
        setShowDrawings(true);
      });
    }
    return () => {
      if (socket) {
        socket.off('flipbookData');
        socket.off('nextRound');
        socket.off('endGame');
      }
    };
  }, [socket]);
  
  return (
    <div
    className="bg-contain"
    style={{
      backgroundImage: "url('../whiteboard_background_seamless.jpg')",
      backgroundRepeat: 'repeat-y', // Repeats the background image vertically
      backgroundSize: showDrawings ? 'auto' : 'cover',
      backgroundPosition: 'center',
      height: 'auto', // Adjust the height as per your content
      minHeight: '100vh', // Ensures minimum height of the viewport
      width: '100vw',
    }}
    >
    <div className="flex flex-col items-center w-full h-full">
      {!gameStarted && (
        <Lobby roomId={roomId} onStartGame={handleGameStarted} onGameStarted={handleGameStarted} />
      )}
      {gameStarted && !showDrawings && currentRound % 2 === 1 && (
        <DrawingPage roomId={roomId} previousGuess={previousWord} onViewDrawings={handleShowDrawings} />
      )}
      {gameStarted && !showDrawings && currentRound % 2 === 0 && (
        <GuessingPage roomId={roomId} drawingToGuess={previousDrawing} onViewDrawings={handleShowDrawings} />
      )}
      {gameStarted && showDrawings && (
        <DisplayDrawingsPage roomId={roomId} onBack={() => setShowDrawings(false)} />
      )}
    </div> 
  </div>
  );
};

export default Room;
