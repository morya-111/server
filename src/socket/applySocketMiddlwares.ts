import { User } from "../entity/User";
import { EnhancedIO, SocketMiddleware } from "../types";

const applySocketMiddlewares = (io: EnhancedIO) => {
  io.use(authMiddleware);
};

const authMiddleware: SocketMiddleware = async (socket, next) => {
  const userId = socket.handshake.auth.id;

  console.log("User Id", userId);

  if (!userId) {
    return next(new Error("invalid id"));
  }
  const user = await User.findOne(userId);

  if (!user) {
    return next(new Error("invalid user"));
  }

  console.log(`[Socket Authenticated] : User Id : ${user.id}`);

  socket.data.user = user;

  next();
};

export default applySocketMiddlewares;
