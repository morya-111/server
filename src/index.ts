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
import {} from "./socket/handlers";
import applySocketMiddlewares from "./socket/applySocketMiddlwares";

const { PORT = 4000, LATENCY = "0", FRONTEND_CLIENT } = process.env;

(async () => {
  await createConnection();

  const httpServer = createServer(app);

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
    // registerAuthHandler(io, socket);
  };

  io.on("connection", onConnection);

  httpServer.listen(PORT, () => {
    console.log(`[SERVER STARTED] on http://localhost:${PORT}`);
    console.log(`[LATENCY] ${LATENCY} ms`);
  });
})().catch((err) => {
  console.log(err);
});
