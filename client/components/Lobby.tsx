// client/components/Lobby.tsx

import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

interface LobbyProps {
  roomId: string | string[];
}

const Lobby: React.FC<LobbyProps> = ({ roomId }) => {
  const socket = useSocket();
  const [users, setUsers] = useState<string[]>([]);
  const [isHost, setIsHost] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/getUsernamesInARoom?roomId=${roomId}`);
      const data = await response.json();
      setUsers(data.usernames);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchHost = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/getHost?roomId=${roomId}`);
      const data = await response.json();
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
  
    if (socket) {
      // Add listener for 'userJoined' event
      socket.on('userJoined', () => {
        fetchUsers(); // Refresh the user list when a new user joins the room
      });
  
      // Clean up the listener when the component is unmounted
      return () => {
        socket.off('userJoined');
      };
    }
  }, [roomId, socket]);

  // Handle the game start event
  const handleStartGame = () => {
    if (socket) {
      socket.emit('startGame', roomId);
    }
  };
  

  return (
    <div>
      <h2 className='page-description'>
        Users in Room {roomId}:
      </h2>
      <ul className="user-list">
        {users && users.map((user, index) => (
          <li key={index} className="username-display">
            {user}
          </li>
        ))}
      </ul>
      {isHost && (
        <button onClick={handleStartGame} className="start-game-button">
          Start Game
        </button>
      )}

    </div>
  );
};

export default Lobby;
