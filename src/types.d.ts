import { Server, Socket } from "socket.io";
import { Chat } from "./entity/Chat";
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
  "message:receive": (chats: Chat[]) => void;
}

interface ClientToServerEvents {
  "message:send": (payload: MessagePayload) => void;
  test: () => void;
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

type ActionFunction<T = any> = (
  io: EnhancedIO,
  socket: EnhancedSocket,
  payload: T
) => void;
