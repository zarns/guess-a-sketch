// server/rooms.ts

import { Socket } from 'socket.io';
import FlipBook from './flipbook';
import wordsJson from './words.json';

const wordsDict: string[] = wordsJson.words;

class Room {
  id: string;
  creator: Socket;
  usernameMap: Map<Socket, string>;
  drawings: Map<string, string>;
  flipBooks: Map<string, FlipBook>;

  constructor(roomId: string, creator: Socket, creatorUsername: string) {
    this.id = roomId;
    this.creator = creator;
    this.usernameMap = new Map([[creator, creatorUsername]]);
    this.drawings = new Map();
    this.flipBooks = new Map();
  }

  addUser(user: Socket, username: string): void {
    this.usernameMap.set(user, username);
  }

  removeUser(user: Socket): void {
    this.usernameMap.delete(user);
    if (this.creator === user) {
      this.creator = Array.from(this.usernameMap.keys())[0];
    }
  }

  assignWords() {
    const uniqueWords = this.getRandomWords(this.usernameMap.size);
    let wordIndex = 0;
  
    this.usernameMap.forEach((username, socket) => {
      const word = uniqueWords[wordIndex];
      this.flipBooks.set(username, new FlipBook(word));
      wordIndex++;
    });
  }

  saveDrawing(socket: Socket, drawingDataUrl: string) {
    let username = this.usernameMap.get(socket);

    if (!username) {
      console.error(`Error: username not found in the usernameMap`);
      return;
    }

    let flipbook = this.flipBooks.get(username);

    if (!flipbook) {
      console.error(`Error: username not found in the flipBooks map`);
      return;
    }

    flipbook.addDrawing(drawingDataUrl);
    console.log(`Drawing saved for room ${this.id}`);
  }

  viewAllDrawings(callback: (username: string, data: { type: 'drawing' | 'guess', content: string }[] | null, err?: Error) => void) {
    for (const [username, flipbook] of this.flipBooks.entries()) {
      const pages = flipbook.getPages();
      callback(username, pages);
    }
  }

  private getRandomWords(numWords: number): string[] {
    const uniqueWords = new Set<string>();
    while (uniqueWords.size < numWords) {
      const randomWord = wordsDict[Math.floor(Math.random() * wordsDict.length)];
      uniqueWords.add(randomWord);
    }
    return Array.from(uniqueWords);
  }
}

class Rooms {
  private static instance: Rooms;
  private rooms: Map<string, Room>;

  private constructor() {
    this.rooms = new Map();
  }

  static getInstance(): Rooms {
    if (!Rooms.instance) {
      Rooms.instance = new Rooms();
    }
    return Rooms.instance;
  }

  createRoom(roomId: string, creator: Socket, creatorUsername: string): void {
    const room = new Room(roomId, creator, creatorUsername); // create a new Room object
    this.rooms.set(roomId, room);
    console.log('Number of active rooms:', this.rooms.size);
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }
  
  joinRoom(roomId: string, user: Socket, username: string): void {
    const room = this.getRoom(roomId);
    if (room) {
      room.addUser(user, username);
    }
  }

  leaveRoom(roomId: string, user: Socket): void {
    const room = this.getRoom(roomId);
    if (room) {
      room.removeUser(user);
    }
  }

  removeRoom(roomId: string): void {
    const room = this.getRoom(roomId);
    if (room) {
      this.rooms.delete(roomId);
    }
  }

  removeUserFromAllRooms(user: Socket): void {
    this.rooms.forEach(room => {
      room.removeUser(user);
    });
  }

  getAllUsernames(): string[][] {
    const allRooms: string[][] = [];
    this.rooms.forEach(room => {
      const usernames = Array.from(room.usernameMap.values());
      // Add the room id at the beginning of the array
      usernames.unshift(room.id);
      allRooms.push(usernames);
    });
    return allRooms;
  }

  getUsernamesInARoom(roomId: string): string[] | undefined {
    const room = this.getRoom(roomId);
    if (room) {
      return Array.from(room.usernameMap.values());
    }
  }

  getHost(roomId: string): Socket | undefined {
    const room = this.getRoom(roomId);
    if (room) {
      return room.creator;
    }
  }

  removeEmptyRooms() {
    this.rooms.forEach(room => {
      if (room.usernameMap.size === 0) {
        this.rooms.delete(room.id);
      }
    });
  }
}

export default Rooms;
