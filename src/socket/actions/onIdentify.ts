import { EnhancedIO, EnhancedSocket } from "../../types";

const onIdentify = (io: EnhancedIO, socket: EnhancedSocket, payload) => {
  const { _id } = payload;
  socket.data._id = _id;
};

export default onIdentify;
