import { Router } from "express";
import { getAllChatsByUserId } from "../controllers/chatController";

import { protect } from "../controllers/authController";

const chatRouter = Router();

chatRouter.get("/:userId", protect(), getAllChatsByUserId);

export default chatRouter;
