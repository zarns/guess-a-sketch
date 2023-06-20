// client/pages/[roomId].tsx

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Lobby from '../components/Lobby'
import DrawingPage from '../components/DrawingPage';
import DisplayDrawingsPage from '../components/DisplayDrawingsPage';
import { useSocket } from '../contexts/SocketContext';

const Room: React.FC = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const [gameStarted, setGameStarted] = useState(false);
  const [showDrawings, setShowDrawings] = useState(false);
  const socket = useSocket();

  const handleGameStarted = () => {
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
  
  return (
    <div
      className="bg-cover bg-center h-screen"
      style={{
        backgroundImage: "url(../whiteboard_background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="flex flex-col items-center w-full h-full">
        {!gameStarted && (
          <Lobby roomId={roomId} onStartGame={() => setGameStarted(true)} onGameStarted={handleGameStarted} />
        )}
        {gameStarted && !showDrawings && (
          <DrawingPage roomId={roomId} onViewDrawings={handleShowDrawings} />
        )}
        {gameStarted && showDrawings && (
          <DisplayDrawingsPage roomId={roomId} onBack={() => setShowDrawings(false)} />
        )}
      </div>
    </div>
  );
};

export default Room;
