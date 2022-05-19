import { User } from "../entity/User";
import { EnhancedIO, SocketMiddleware } from "../types";
import SocketStore from "./socketStore";

const applySocketMiddlewares = (io: EnhancedIO) => {
  io.use(authMiddleware);
};

const authMiddleware: SocketMiddleware = async (socket, next) => {
  const userId = socket.handshake.auth.userId;

  console.log({ auth: socket.handshake.auth });

  console.log("User Id", userId);

  if (!userId) {
    return next(new Error("invalid id"));
  }
  const user = await User.findOne(userId);

  if (!user) {
    return next(new Error("invalid user"));
  }

  console.log(`[Socket Authenticated] : User Id : ${user.id}`);

  SocketStore.Instance.addSocket(user.id, socket);

  socket.data.user = user;

  next();
};

export default applySocketMiddlewares;
