// server/rooms.ts

import { Socket } from 'socket.io';

class Room {
  users: Set<Socket>;
  creator: Socket;

  constructor(creator: Socket) {
    this.creator = creator;
    this.users = new Set([creator]);
  }

  public addUser(user: Socket): void {
    this.users.add(user);
  }

  public removeUser(user: Socket): void {
    this.users.delete(user);
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

  public createRoom(roomId: string, creator: Socket): void {
    creator.join(roomId);
    const room = new Room(creator); // create a new Room object
    this.rooms.set(roomId, room);
  }

  public getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }
  
  public joinRoom(roomId: string, user: Socket): void {
    const room = this.rooms.get(roomId);
    if (room) {
      user.join(roomId);
      room.users.add(user);
    }
  }

  public leaveRoom(roomId: string, user: Socket): void {
    const room = this.rooms.get(roomId);
    if (room) {
      user.leave(roomId);
      room.users.delete(user);
      if (room.creator === user) {
        this.rooms.delete(roomId);
      }
    }
  }

  public removeRoom(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.users.forEach(user => {
        user.leave(roomId);
      });
      this.rooms.delete(roomId);
    }
  }  

  public removeUserFromAllRooms(user: Socket): void {
    console.log(this.rooms.size);
    this.rooms.forEach(room => {
      room.removeUser(user);
    });
  }
}

export default Rooms;
