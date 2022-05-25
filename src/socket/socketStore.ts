import { EnhancedSocket } from "../types";

export default class SocketStore {
  private static _instance: SocketStore;

  private static sockets: Record<number, EnhancedSocket> = {};

  addSocket(userId: number, socket: EnhancedSocket) {
    SocketStore.sockets[userId] = socket;
  }

  getSocket(userId: number) {
    return SocketStore.sockets[userId];
  }

  removeSocket(userId: number) {
    delete SocketStore.sockets[userId];
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }
}
