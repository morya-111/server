import { SocketIOHandler } from "../../types";
import { onMessage } from "../actions";

const messageHandler: SocketIOHandler = (io, socket) => {
  socket.on("message:send", (payload) => onMessage(io, socket, payload));
};

export default messageHandler;
