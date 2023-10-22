// client/pages/[roomId].tsx

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Lobby from '../components/Lobby'
import DrawingPage from '../components/DrawingPage';
import DisplayDrawingsPage from '../components/DisplayDrawingsPage';
import GuessingPage from '../components/GuessingPage';
import { useSocket } from '../contexts/SocketContext';

const Room: React.FC = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const [gameStarted, setGameStarted] = useState(false);
  const [showDrawings, setShowDrawings] = useState(false);
  const socket = useSocket();
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [previousWord, setPreviousWord] = useState<string | null>(null);
  const [previousDrawing, setPreviousDrawing] = useState<string | null>(null);

  useEffect(() => {
    console.log(`Current Round: ${currentRound}`);
    if (currentRound % 2 === 0) {
      setPreviousWord("delete me");
    } else {
      setPreviousDrawing("asdfasdfasdf");
    }
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
      socket.on('flipbookData', (latestPage, newCurrentRound) => {
        setPreviousDrawing(latestPage.drawingDataUrl);
        console.log("flipbookData event. setPreviousDrawing");
      });
      socket.on('nextRound', (newCurrentRound) => {
        setCurrentRound(newCurrentRound);
      });
    }
    return () => {
      if (socket) {
        socket.off('flipbookData');
        socket.off('nextRound');
      }
    };
  }, [socket]);
  
  return (
    <div
      className="bg-contain"
      style={{
        backgroundImage: "url(../whiteboard_background_seamless.jpg)",
        backgroundRepeat: "repeat-y",
        backgroundPosition: "center"
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
