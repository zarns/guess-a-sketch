// server/rooms.ts

import { Socket } from 'socket.io';

class Room {
  id: string;
  users: Set<Socket>;
  creator: Socket;
  usernameMap: Map<Socket, string>;

  constructor(roomId: string, creator: Socket, creatorUsername: string) {
    this.id = roomId;
    this.creator = creator;
    this.users = new Set([creator]);
    this.usernameMap = new Map([[creator, creatorUsername]]);
  }

  public addUser(user: Socket, username: string): void {
    this.users.add(user);
    this.usernameMap.set(user, username);
  }

  public removeUser(user: Socket): void {
    this.users.delete(user);
    this.usernameMap.delete(user);
    if (this.creator === user) {
      this.creator = Array.from(this.users)[0];
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

  public getUsernames(): string[][] {
    const allRooms: string[][] = [];
    this.rooms.forEach(room => {
      const usernames = Array.from(room.usernameMap.values());
      // Add the room id at the beginning of the array
      usernames.unshift(room.id);
      allRooms.push(usernames);
    });
    return allRooms;
  }
  
}

export default Rooms;
