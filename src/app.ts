import { config } from "dotenv";
config();
import express, { json } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import bookRouter from "./routes/bookRoutes";

import userRouter from "./routes/userRoutes";
import googleAuthRouter from "./routes/googleAuthRoutes";
import facebookAuthRouter from "./routes/facebookAuthRoutes";
import globalErrorhandler from "./controllers/errorController";
import { protect } from "./controllers/authController";
import configureGoogleAuth from "./utils/configureGoogleAuth";
import configureFacebookAuth from "./utils/configureFacebookAuth";

import imageRouter from "./routes/imageRoutes";

const app = express();

const { LATENCY = "0", FRONTEND_CLIENT = "http://localhost:3000" } =
  process.env;

app.use(cors({ credentials: true, origin: FRONTEND_CLIENT }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(json());
app.use((_, __, next) => {
  setTimeout(() => {
    next();
  }, parseInt(LATENCY));
});

app.use(cookieParser());

app.use(passport.initialize());

configureGoogleAuth();

configureFacebookAuth();

app.use("/v1/books", bookRouter);
app.use("/v1/images", imageRouter);

app.use("/v1/user", userRouter);

app.use("/v1/auth/google", googleAuthRouter);

app.use("/v1/auth/facebook", facebookAuthRouter);

// TEST ROUTES

app.get("/v1/loginprotected", protect(), (_, res) => {
  res.status(200).json({ status: "success" });
});

app.get("/v1/roleprotected", protect(["ADMIN"]), (_, res) => {
  res.status(200).json({ status: "success" });
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
  });
});

app.use(globalErrorhandler);

export default app;
