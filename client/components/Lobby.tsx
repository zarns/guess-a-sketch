// client/components/Lobby.tsx

import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

interface LobbyProps {
  roomId: string | string[];
  onStartGame: () => void;
  onGameStarted: () => void;
}


const Lobby: React.FC<LobbyProps> = ({ roomId, onStartGame }) => {
  const socket = useSocket();
  const [users, setUsers] = useState<string[]>([]);
  const [isHost, setIsHost] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/getUsernamesInARoom?roomId=${roomId}`);
      const data = await response.json();
      setUsers(data.usernames);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchHost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/getHost?roomId=${roomId}`);
      const data = await response.json();
      console.log('data.host:', data.hostId)
      if (socket && data.hostId === socket.id) {
        setIsHost(true);
      }
    } catch (error) {
      console.error('Error fetching host:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchHost();
  }, [roomId]);

  // Listen for events related to users joining and leaving the room
  // useEffect(() => {
  //   if (socket) {
  //     socket.emit('joinRoom', roomId);

  //     socket.on('users', (usersInRoom: string[], host: boolean) => {
  //       setUsers(usersInRoom);
  //       setIsHost(host);
  //     });

  //     return () => {
  //       socket.off('users');
  //       socket.off('newMessage');
  //     };
  //   }
  // }, [socket, roomId]);

  // Handle the game start event
  const handleStartGame = () => {
    if (socket) {
      socket.emit('startGame', roomId);
    }
    onStartGame();
  };
  

  return (
    <div>
      <h2>Users in Room {roomId}:</h2>
      <ul>
        {users && users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
      {isHost && (
        <button onClick={handleStartGame} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Start Game
        </button>
      )}

    </div>
  );
};

export default Lobby;
