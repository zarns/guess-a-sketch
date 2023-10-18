// server/server.ts
import express from 'express';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import Rooms from './rooms';
import FlipBook from './flipbook';


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

  socket.on('startGame', (roomId: string) => {
    const room = rooms.getRoom(roomId);
    if (!room) {
      console.error('Error: room not found');
      return;
    }
    
    room.buildFlipBooks();
    
    socket.to(roomId).emit('gameStarted');
  });  

  socket.on('joinRoom', (roomId: string, username: string) => {
    const room = rooms.getRoom(roomId); // Retrieve the room data from the Rooms instance
    if (room) {
      socket.join(roomId);
      room.addUser(socket, username); // Add the user to the room's Set of users
      socket.emit('roomJoined', roomId);
      io.in(roomId).emit('userJoined'); // Emit 'userJoined' event to all users in the room
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

  socket.on('giveMeAFlipBook', (roomId: string) => {
    const room = rooms.getRoom(roomId);
    if (!room) {
      console.error('Error: room not found');
      return;
    }
  
    const page = room.getNextFlipbookFor(socket)?.getLatestPage();
    socket.emit('flipbookData', page, room.currentRound);
  });

  socket.on('saveDrawing', ({ roomId, drawingDataUrl }) => {
    console.log(`saveDrawing event in room: ${roomId}`);
    const room = rooms.getRoom(roomId);
    if (!room) {
      console.error('Error: room not found');
      socket.emit('drawingError', 'Error saving drawing');
      return;
    }
    room.saveDrawing(socket, drawingDataUrl);
    const currRound = room.checkPhaseCompletion();
    if (currRound === -1) {
      return;
    }
    socket.emit('nextRound', currRound);
  });

  socket.on('submitGuess', ({ roomId, guess }) => {
    console.log(`submitGuess event in room: ${roomId}`);
    const room = rooms.getRoom(roomId);
    if (!room) {
      console.error('Error: room not found');
      socket.emit('guessError', 'Error submitting guess');
      return;
    }
    room.saveGuess(socket, guess);
  });

  socket.on('viewAllDrawings', (roomId: string) => {
    const room = rooms.getRoom(roomId);
    if (!room) {
      console.error('Error: room not found');
      return;
    }
  
    const allFlipbooksInRoom = room.viewAllDrawings();
    socket.emit('allFlipbooksData', allFlipbooksInRoom);
    console.log(`Sent allFlipbooksData event in room: ${roomId}.`); 
    // console.log(`Data: ${JSON.stringify(allFlipbooksInRoom)}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Get the room that the user is in
    rooms.removeUserFromAllRooms(socket);
  });
});

app.get('/allUsernames', (req, res) => {
  const allUsernames = rooms.getAllUsernames();
  res.status(200).json({ allUsernames });
});

app.get('/getUsernamesInARoom', (req, res) => {
  const roomId = req.query.roomId as string;
  const usernames = rooms.getUsernamesInARoom(roomId);
  res.status(200).json({ usernames });
});

app.get('/getHost', (req, res) => {
  const roomId = req.query.roomId as string;
  const room = rooms.getRoom(roomId);
  const hostId = room?.creator?.id;
  res.status(200).json({ hostId });
});

const EMPTY_ROOM_CHECK_INTERVAL = 120 * 1000; // e.g., every 120 seconds

// Periodically remove empty rooms
setInterval(() => {
  rooms.removeEmptyRooms();
}, EMPTY_ROOM_CHECK_INTERVAL);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
