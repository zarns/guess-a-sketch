// server/rooms.ts

import { Socket } from 'socket.io';
import fs from 'fs';
import path from 'path';

class Room {
  id: string;
  creator: Socket;
  usernameMap: Map<Socket, string>;
  drawings: Map<string, string>;

  constructor(roomId: string, creator: Socket, creatorUsername: string) {
    this.id = roomId;
    this.creator = creator;
    this.usernameMap = new Map([[creator, creatorUsername]]);
    this.drawings = new Map();
  }

  public addUser(user: Socket, username: string): void {
    this.usernameMap.set(user, username);
  }

  public removeUser(user: Socket): void {
    this.usernameMap.delete(user);
    if (this.creator === user) {
      this.creator = Array.from(this.usernameMap.keys())[0];
    }
  }

  saveDrawing(socket: Socket, drawingDataUrl: string, callback: (err: Error | null, message?: string) => void) {
    const base64Data = drawingDataUrl.replace(/^data:image\/png;base64,/, '');
    const drawingsPath = path.join(__dirname, 'drawings');
    const imagePath = path.join(drawingsPath, `${this.id}_${socket.id}.png`);

    // Check if the 'drawings' directory exists and create it if not
    fs.mkdir(drawingsPath, { recursive: true }, (err) => {
      if (err && err.code !== 'EEXIST') {
        console.error('Error creating drawings directory:', err);
        callback(err);
        return;
      }

      // Save the drawing to the 'drawings' directory
      fs.writeFile(imagePath, base64Data, 'base64', (err) => {
        if (err) {
          console.error('Error saving drawing:', err);
          callback(err);
          return;
        }

        console.log(`Drawing saved for room ${this.id}`);
        this.drawings.set(socket.id, imagePath);
        callback(null, `Drawing saved for room ${this.id}`);
      });
    });
  }

  viewAllDrawings(socket: Socket, callback: (index: number, imageData: string | null, err?: Error) => void) {
    const drawingFiles = Array.from(this.drawings.values());

    const readAndSendDrawing = (index: number) => {
      if (index >= drawingFiles.length) {
        callback(index, null);
        return;
      }

      fs.readFile(drawingFiles[index], 'base64', (err, data) => {
        if (err) {
          console.error('Error reading drawing:', err);
          callback(index, null, err);
          return;
        }
        const imageData = `data:image/png;base64,${data}`;
        callback(index, imageData);
        readAndSendDrawing(index + 1);
      });
    };

    readAndSendDrawing(0);
  }
}

class Rooms {
  private static instance: Rooms;
  private rooms: Map<string, Room>;

  private constructor() {
    this.rooms = new Map();
  }

  public static getInstance(): Rooms {
    if (!Rooms.instance) {
      Rooms.instance = new Rooms();
    }
    return Rooms.instance;
  }

  public createRoom(roomId: string, creator: Socket, creatorUsername: string): void {
    const room = new Room(roomId, creator, creatorUsername); // create a new Room object
    this.rooms.set(roomId, room);
    console.log('Number of active rooms:', this.rooms.size);
  }

  public getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }
  
  public joinRoom(roomId: string, user: Socket, username: string): void {
    const room = this.getRoom(roomId);
    if (room) {
      room.addUser(user, username);
    }
  }

  public leaveRoom(roomId: string, user: Socket): void {
    const room = this.getRoom(roomId);
    if (room) {
      room.removeUser(user);
    }
  }

  public removeRoom(roomId: string): void {
    const room = this.getRoom(roomId);
    if (room) {
      this.rooms.delete(roomId);
    }
  }

  public removeUserFromAllRooms(user: Socket): void {
    this.rooms.forEach(room => {
      room.removeUser(user);
    });
  }

  public getAllUsernames(): string[][] {
    const allRooms: string[][] = [];
    this.rooms.forEach(room => {
      const usernames = Array.from(room.usernameMap.values());
      // Add the room id at the beginning of the array
      usernames.unshift(room.id);
      allRooms.push(usernames);
    });
    return allRooms;
  }

  public getUsernamesInARoom(roomId: string): string[] | undefined {
    const room = this.getRoom(roomId);
    if (room) {
      return Array.from(room.usernameMap.values());
    }
  }

  public getHost(roomId: string): Socket | undefined {
    const room = this.getRoom(roomId);
    if (room) {
      return room.creator;
    }
  }

  public removeEmptyRooms() {
    this.rooms.forEach(room => {
      if (room.usernameMap.size === 0) {
        this.rooms.delete(room.id);
      }
    });
  }
}

export default Rooms;
