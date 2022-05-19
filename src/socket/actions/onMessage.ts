import { getManager } from "typeorm";
import { Chat, MessageType } from "../../entity/Chat";
import { Participant } from "../../entity/Participant";
import { Room } from "../../entity/Room";
import { ActionFunction } from "../../types";
import { MessagePayload } from "../../types/SocketTypes";
import SocketStore from "../socketStore";

const onMessage: ActionFunction<MessagePayload> = async (
  io,
  socket,
  payload
) => {
  // ! Validate payload and do error handling @athhb

  const { message, to, bookId } = payload;

  console.log("On Message", payload);

  const result: { roomId: number }[] = await getManager().query(
    `
    SELECT DISTINCT p1."roomId" AS "roomId"
    FROM   participant p1, participant p2
    WHERE  p1."userId" = $1 AND p2."userId" = $2
    AND    p1."roomId" = p2."roomId";
    `,
    [to, socket.data.user.id]
  );

  let room: Room;
  if (result.length === 0) {
    // room not found hence create
    room = await Room.create({}).save();
    await Participant.create({ room, user: { id: to } }).save();
    await Participant.create({
      room,
      user: { id: socket.data.user.id },
    }).save();
  } else {
    // room found
    const { roomId } = result[0];
    room = await Room.findOne(roomId);
  }

  const broadcastMessages: Chat[] = [];

  const embeddedChat = await checkAndCreateEmbeddedMessage(
    room.id,
    bookId,
    socket.data.user.id,
    to
  );

  if (embeddedChat) broadcastMessages.push(embeddedChat);

  const sentMessage = await Chat.create({
    book: { id: bookId },
    room,
    message,
    sender: { id: socket.data.user.id },
  }).save();

  broadcastMessages.push(sentMessage);

  SocketStore.Instance.getSocket(to).emit("message:receive", broadcastMessages);
  // SocketStore.Instance.getSocket(socket.data.user.id).emit(
  //   "message:receive",
  //   broadcastMessages
  // );
};

const checkAndCreateEmbeddedMessage = async (
  roomId: number,
  bookId: number,
  senderId: number,
  receiverId: number
): Promise<Chat | undefined> => {
  let existingEmbeddedChat = await Chat.findOne({
    where: {
      room: { id: roomId },
      book: { id: bookId },
      type: MessageType.EMBEDDED,
    },
  });

  if (!existingEmbeddedChat) {
    existingEmbeddedChat = await Chat.create({
      book: { id: bookId },
      room: { id: roomId },
      sender: { id: senderId },
      message: generateEmbeddedMessage(senderId, receiverId),
      type: MessageType.EMBEDDED,
    }).save();
    return existingEmbeddedChat;
  }
};

const generateEmbeddedMessage = (senderId: number, receiverId: number) => {
  return `<<${senderId}>> started a conversation with <<${receiverId}>> for this book, click to know more!`;
};

export default onMessage;
