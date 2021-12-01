import { Router } from "express";
import {
  login,
  register,
  logout,
  protect,
  isLoggedIn,
} from "../controllers/authController";

import { updateUser, deleteUserAccount } from "../controllers/userController";

const userRouter = Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.post("/logout", logout);

userRouter.get("/isloggedin", protect(), isLoggedIn);

userRouter.put("/updateuser", protect(), updateUser);
userRouter.delete("/deleteuser", protect(), deleteUserAccount);

export default userRouter;
