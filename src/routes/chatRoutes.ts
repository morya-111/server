import { Router } from "express";
import {
  getAllChatsByUserId,
  getChatUsers,
} from "../controllers/chatController";

import { protect } from "../controllers/authController";

const chatRouter = Router();

chatRouter.get("/users", protect(), getChatUsers);

chatRouter.get("/:userId", protect(), getAllChatsByUserId);

export default chatRouter;
