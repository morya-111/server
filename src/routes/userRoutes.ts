import { Router } from "express";
import {
  login,
  register,
  logout,
  protect,
  isLoggedIn,
} from "../controllers/authController";

const userRouter = Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.post("/logout", logout);

userRouter.get("/login", protect(), isLoggedIn);

export default userRouter;
