import { Router } from "express";
import {
  getAllChatsByUserId,
  getChatChannel,
  getChatUsers,
  sendMessage,
} from "../controllers/chatController";

import { protect } from "../controllers/authController";

const chatRouter = Router();

chatRouter.get("/users", protect(), getChatUsers);

chatRouter.get("/channel", protect(), getChatChannel);

chatRouter.post("/send", protect(), sendMessage);

chatRouter.get("/:userId", protect(), getAllChatsByUserId);

export default chatRouter;
