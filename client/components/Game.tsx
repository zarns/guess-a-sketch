import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../contexts/SocketContext';

const Game: React.FC = () => {
  const socket = useSocket();
  const [roomId, setRoomId] = useState<string>('');
  const router = useRouter();

  const createRoom = (username: string) => {
    console.log('Create room button clicked');
    if (socket) {
      socket.emit('createRoom', username);
    }
  };

  const joinRoom = (roomId: string, username: string) => {
    console.log(username, 'clicked join room ID:', roomId);
    if (socket) {
      socket.emit('joinRoom', roomId, username);
    }
  };

  const leaveRoom = (roomId: string) => {
    console.log('Leave room button clicked:', roomId);
    if (socket) {
      socket.emit('leaveRoom', roomId);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (socket) {
        socket.emit('leaveRoom', roomId);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [socket, roomId]);
  // ...

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-black font-permanent-marker">Guess-A-Sketch</h1>
      <div className="flex flex-col space-y-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const username = formData.get('username') as string;
            createRoom(username);
          }}
        >
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Create Room
            </button>
          </div>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const roomId = formData.get('roomId') as string;
            const username = formData.get('username') as string;
            joinRoom(roomId, username);
          }}
        >
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="roomId" className="block text-gray-700 font-bold mb-2">
                Room ID
              </label>
              <input
                type="text"
                id="roomId"
                name="roomId"
                placeholder="Enter room ID"
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Game;
