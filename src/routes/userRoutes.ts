import { Router } from "express";
import { login, register, logout } from "../controllers/authController";

const userRouter = Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.post("/logout", logout);

export default userRouter;
