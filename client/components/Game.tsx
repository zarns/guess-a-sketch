import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/router';

const Game: React.FC = () => {
  const socketRef = useRef<Socket>();
  const [roomId, setRoomId] = useState<string>('');
  const router = useRouter();

  const createRoom = () => {
    console.log('Create room button clicked');
    socketRef.current.emit('createRoom');
  };

  const joinRoom = (roomId: string) => {
    console.log('Join room button clicked:', roomId);
    socketRef.current.emit('joinRoom', roomId);
  };

  const leaveRoom = (roomId: string) => {
    console.log('Leave room button clicked:', roomId);
    socketRef.current.emit('leaveRoom', roomId);
  };

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      console.log('Connected to server:', socketRef.current.id);
    });

    socketRef.current.on('roomCreated', (roomId: string) => {
      console.log('Room created:', roomId);
      router.push(`/${roomId}`);
    });

    socketRef.current.on('roomJoined', (roomId: string) => {
      console.log('Joined room:', roomId);
      router.push(`/${roomId}`);
    });

    socketRef.current.on('roomNotFound', () => {
      console.log('Room not found');
    });

    socketRef.current.on('roomLeft', (roomId: string) => {
      console.log('Left room:', roomId);
    });

    // Clean up the socket connection when the component is unmounted
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-4">Telestrations Game</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
        onClick={createRoom}
      >
        Create Room
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          joinRoom(e.currentTarget.roomId.value);
        }}
      >
        <div className="mb-4">
          <label htmlFor="roomId" className="block text-gray-700 font-bold mb-2">
            Join Room
          </label>
          <input
            type="text"
            id="roomId"
            name="roomId"
            placeholder="Enter room ID"
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-4"
          type="submit"
        >
          Join Room
        </button>
      </form>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={() => leaveRoom('ROOM_ID_HERE')}
      >
        Leave Room
      </button>
    </div>
  );
};

export default Game;
