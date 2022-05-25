import "reflect-metadata";
import { config } from "dotenv";
config();
import app from "./app";
import { createConnection } from "typeorm";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  EnhancedSocket,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";
import { messageHandler } from "./socket/handlers";
import applySocketMiddlewares from "./socket/applySocketMiddlwares";
import SocketStore from "./socket/socketStore";

const { PORT = 4000, LATENCY = "0", FRONTEND_CLIENT } = process.env;

(async () => {
  await createConnection();

  const httpServer = createServer(app);

  // ---- SOCKET

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      credentials: true,
      origin: FRONTEND_CLIENT,
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    },
  });

  applySocketMiddlewares(io);

  const onConnection = (socket: EnhancedSocket) => {
    console.log("New Connection");
    messageHandler(io, socket);

    socket.on("disconnect", () => {
      SocketStore.Instance.removeSocket(socket.data.user.id);
    });
  };

  io.on("connection", onConnection);

  // ---- SOCKET

  httpServer.listen(PORT, () => {
    console.log(`[SERVER STARTED] on http://localhost:${PORT}`);
    console.log(`[LATENCY] ${LATENCY} ms`);
  });
})().catch((err) => {
  console.log(err);
});
