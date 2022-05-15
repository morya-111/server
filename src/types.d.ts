import { Server, Socket } from "socket.io";
import { User } from "./entity/User";
export type RoleType = "INDIVIDUAL" | "SHOP_OWNER" | "ADMIN";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

interface ServerToClientEvents {
  ACK: () => void;
}

interface ClientToServerEvents {
  MESSAGE: (payload: { to: number; from: number }) => void;
  TEST: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  user?: User;
}

type EnhancedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type EnhancedIO = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type SocketIOHandler = (io: EnhancedIO, socket: EnhancedSocket) => void;

type SocketMiddleware = (socket: EnhancedSocket, next: Function) => void;
