// server/server.ts
import express from 'express';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import Rooms from './rooms';

const app = express();
app.use(cors()); // Enable CORS for all routes

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow the client's origin
    methods: ['GET', 'POST'],
  },
});

const rooms = Rooms.getInstance(); // Get an instance of the Rooms class

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', (creatorUsername: string) => {
    const roomId = Math.floor(Math.random() * 1000).toString(); // Generate a random room number and convert it to a string
    socket.join(roomId);
    rooms.createRoom(roomId, socket, creatorUsername); // Add the room to the Rooms instance
    socket.emit('roomCreated', roomId);
    console.log('Created room ID:', roomId);
  });

  socket.on('joinRoom', (roomId: string, username: string) => {
    const room = rooms.getRoom(roomId); // Retrieve the room data from the Rooms instance
    if (room) {
      socket.join(roomId);
      room.addUser(socket, username); // Add the user to the room's Set of users
      socket.emit('roomJoined', roomId);
      console.log('Joined room ID:', roomId);
    } else {
      socket.emit('roomError', 'Room not found');
    }
  });

  socket.on('leaveRoom', (roomId: string) => {
    console.log('Received leaveRoom event for room ID:', roomId);
    const room = rooms.getRoom(roomId); // Retrieve the room data from the Rooms instance
    if (room) {
      socket.leave(roomId);
      room.removeUser(socket); // Remove the user from the room's Set of users
      if (room.creator === socket) {
        // If the user is the room creator, remove the room from the Rooms instance
        rooms.removeRoom(roomId);
      }
      socket.emit('roomLeft', roomId);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Get the room that the user is in
    rooms.removeUserFromAllRooms(socket);
  });

  // ... other socket event handlers ...
});

app.get('/usernames', (req, res) => {
  const allUsernames = rooms.getUsernames();
  res.status(200).json({ allUsernames });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
