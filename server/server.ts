// server/server.ts
import express from 'express';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import Rooms from './rooms';
import fs from 'fs';
import path from 'path';

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

  socket.on('saveDrawing', ({ roomId, drawingDataUrl }) => {
    const base64Data = drawingDataUrl.replace(/^data:image\/png;base64,/, '');
    const drawingsPath = path.join(__dirname, 'drawings');
    const imagePath = path.join(drawingsPath, `${roomId}.png`);
  
    // Check if the 'drawings' directory exists and create it if not
    fs.mkdir(drawingsPath, { recursive: true }, (err) => {
      if (err && err.code !== 'EEXIST') {
        console.error('Error creating drawings directory:', err);
        socket.emit('drawingError', 'Error saving drawing');
        return;
      }
  
      // Save the drawing to the 'drawings' directory
      fs.writeFile(imagePath, base64Data, 'base64', (err) => {
        if (err) {
          console.error('Error saving drawing:', err);
          socket.emit('drawingError', 'Error saving drawing');
          return;
        }
  
        console.log(`Drawing saved for room ${roomId}`);
        socket.emit('drawingSaved', `Drawing saved for room ${roomId}`);
      });
    });
  }); 

  // socket.on('viewDrawings', (roomId: string) => {
  //   const room = rooms.getRoom(roomId);
  //   if (room) {
  //     const imageUrl = `http://localhost:3001/drawings/${roomId}.png`;
  //     socket.emit('drawingURL', imageUrl);
  //   } else {
  //     socket.emit('drawingError', 'Drawing not found');
  //   }
  // });

  socket.on('viewAllDrawings', (roomId: string) => {
    // You can adjust this part to retrieve all the drawing files related to the roomId
    const drawingFiles = [`./drawings/${roomId}.png`];
  
    const readAndSendDrawing = (index: number) => {
      if (index >= drawingFiles.length) {
        return;
      }
  
      fs.readFile(drawingFiles[index], 'base64', (err, data) => {
        if (err) {
          console.error('Error reading drawing:', err);
          return;
        }
        const imageData = `data:image/png;base64,${data}`;
        socket.emit('drawingData', { index, imageData });
        readAndSendDrawing(index + 1);
      });
    };
  
    readAndSendDrawing(0);
  });  

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Get the room that the user is in
    rooms.removeUserFromAllRooms(socket);
  });

  // ... other socket event handlers ...
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
