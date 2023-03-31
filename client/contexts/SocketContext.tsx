import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/router';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

type SocketProviderProps = {
  children: React.ReactNode;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('roomCreated', (roomId: string) => {
      console.log('Room created:', roomId);
      router.push(`/${roomId}`);
    });

    newSocket.on('roomJoined', (roomId: string) => {
      console.log('Joined room:', roomId);
      router.push(`/${roomId}`);
    });

    newSocket.on('roomNotFound', () => {
      console.log('Room not found');
    });

    newSocket.on('roomLeft', (roomId: string) => {
      console.log('Left room:', roomId);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
