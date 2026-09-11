import { RequestHandler } from "express";
import merge from "lodash.merge";
import { getManager, In, Not } from "typeorm";
import { Chat, MessageType } from "../entity/Chat";
import { Participant } from "../entity/Participant";
import { Room } from "../entity/Room";
import { User } from "../entity/User";
import { MessagePayload } from "../types/SocketTypes";
import ApiFeatures from "../utils/ApiFeatures";
import AppError from "../utils/AppError";
import { broadcastToUsers, userTopic } from "../utils/supabase";

export const getAllChatsByUserId: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const currentUserId = (req.user as any).id;

    let existingChats: Chat[] = [];

    const result: { roomId: number }[] = await getManager().query(
      `
        SELECT DISTINCT p1."roomId" AS "roomId"
        FROM   participant p1, participant p2
        WHERE  p1."userId" = $1 AND p2."userId" = $2
        AND    p1."roomId" = p2."roomId";
        `,
      [userId, currentUserId]
    );

    if (result.length === 0) {
      // Room for these users does not exist
      return res.status(200).json({
        status: "success",
        data: { chats: existingChats },
      });
    }

    delete req.query.userId;

    const features = new ApiFeatures(req.query, {
      select: false,
    });

    const findOptions = merge(features.builtQuery, {
      where: { room: { id: result[0].roomId } },
    });

    const chats = await Chat.findAndCount({
      ...findOptions,
      relations: ["room", "sender", "book"],
    });

    res.status(200).json({
      status: "success",
      data: {
        chats: chats[0],
        pagination: features.paginationInfo(chats[1]),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getChatUsers: RequestHandler = async (req, res) => {
  const currentUserId = (req.user as any).id;

  const rooms = await Participant.find({
    where: { user: { id: currentUserId } },
    relations: ["room"],
  });

  const chatUsers = await Participant.find({
    where: {
      room: { id: In(rooms.map((room) => room.room.id)) },
      user: { id: Not(currentUserId) },
    },
    relations: ["user"],
  });

  console.log({ chatUsers });

  res.status(200).json({
    status: "success",
    data: {
      users: chatUsers.map((user) => user.user),
    },
  });
};

// Realtime topic the logged-in user should subscribe to for incoming messages.
export const getChatChannel: RequestHandler = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      topic: userTopic((req.user as any).id),
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  });
};

export const sendMessage: RequestHandler = async (req, res, next) => {
  try {
    const { message, bookId } = req.body as MessagePayload;
    const to = Number((req.body as MessagePayload).to);
    const senderId: number = (req.user as any).id;

    if (typeof message !== "string" || message.trim().length === 0)
      return next(new AppError("Message is required", 400));
    if (message.length > 500)
      return next(new AppError("Message is too long", 400));
    if (!Number.isInteger(to) || to === senderId)
      return next(new AppError("Invalid recipient", 400));
    if (!(await User.findOne(to)))
      return next(new AppError("Recipient not found", 404));

    const result: { roomId: number }[] = await getManager().query(
      `
      SELECT DISTINCT p1."roomId" AS "roomId"
      FROM   participant p1, participant p2
      WHERE  p1."userId" = $1 AND p2."userId" = $2
      AND    p1."roomId" = p2."roomId";
      `,
      [to, senderId]
    );

    let room: Room;
    if (result.length === 0) {
      // room not found hence create
      room = await Room.create({}).save();
      await Participant.create({ room, user: { id: to } }).save();
      await Participant.create({ room, user: { id: senderId } }).save();
    } else {
      room = await Room.findOne(result[0].roomId);
    }

    const broadcastMessages: Chat[] = [];

    const embeddedChat = await checkAndCreateEmbeddedMessage(
      room.id,
      bookId,
      senderId,
      to
    );

    if (embeddedChat) broadcastMessages.push(embeddedChat);

    const sentMessage = await Chat.create({
      book: bookId ? { id: bookId } : undefined,
      room,
      message,
      sender: { id: senderId },
    }).save();

    broadcastMessages.push(sentMessage);

    // reload with relations so clients get the book name for embedded cards
    const chats = await Chat.findByIds(
      broadcastMessages.map((c) => c.id),
      { relations: ["room", "sender", "book"], order: { id: "ASC" } }
    );

    // Delivery is best-effort: the message is already saved, and clients
    // refetch history on focus.
    try {
      await broadcastToUsers([to, senderId], "message:receive", chats);
    } catch (err) {
      console.log("Realtime broadcast failed", err?.response?.data || err);
    }

    res.status(200).json({
      status: "success",
      data: { chats },
    });
  } catch (error) {
    next(error);
  }
};

const checkAndCreateEmbeddedMessage = async (
  roomId: number,
  bookId: number,
  senderId: number,
  receiverId: number
): Promise<Chat | undefined> => {
  if (!bookId) return;
  const existingEmbeddedChat = await Chat.findOne({
    where: {
      room: { id: roomId },
      book: { id: bookId },
      type: MessageType.EMBEDDED,
    },
  });

  if (!existingEmbeddedChat) {
    return await Chat.create({
      book: { id: bookId },
      room: { id: roomId },
      sender: { id: senderId },
      message: generateEmbeddedMessage(senderId, receiverId),
      type: MessageType.EMBEDDED,
    }).save();
  }
};

const generateEmbeddedMessage = (senderId: number, receiverId: number) => {
  return `<<${senderId}>> started a conversation with <<${receiverId}>> for this book, click to know more!`;
};
