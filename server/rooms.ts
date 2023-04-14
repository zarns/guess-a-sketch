// server/rooms.ts

import { Socket } from 'socket.io';

class Room {
  id: string;
  creator: Socket;
  usernameMap: Map<Socket, string>;

  constructor(roomId: string, creator: Socket, creatorUsername: string) {
    this.id = roomId;
    this.creator = creator;
    this.usernameMap = new Map([[creator, creatorUsername]]);
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
