import { RequestHandler } from "express";
import merge from "lodash.merge";
import { getManager, In, Not } from "typeorm";
import { Chat } from "../entity/Chat";
import { Participant } from "../entity/Participant";
import ApiFeatures from "../utils/ApiFeatures";

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
      res.status(200).json({
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
