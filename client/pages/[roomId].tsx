// client/pages/[roomId].tsx

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Lobby from '../components/Lobby'
import DrawingPage from '../components/DrawingPage';

const Room: React.FC = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameStarted = () => {
    setGameStarted(true);
  };

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
        {gameStarted && (
          <DrawingPage roomId={roomId} />
        )}
      </div>
    </div>
  );
};

export default Room;
