import "reflect-metadata";
import { config } from "dotenv";
config();
import express, { json } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import bookRouter from "./routes/bookRoutes";
import languageRouter from "./routes/languageRoutes";
import userRouter from "./routes/userRoutes";
import googleAuthRouter from "./routes/googleAuthRoutes";
import facebookAuthRouter from "./routes/facebookAuthRoutes";
import chatRouter from "./routes/chatRoutes";
import globalErrorhandler from "./controllers/errorController";
import { protect } from "./controllers/authController";
import configureGoogleAuth from "./utils/configureGoogleAuth";
import configureFacebookAuth from "./utils/configureFacebookAuth";

import imageRouter from "./routes/imageRoutes";
import connection from "./connection";

const app = express();

const { LATENCY = "0", FRONTEND_CLIENT = "http://localhost:3000" } =
  process.env;

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_CLIENT,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(json());
app.use((_, __, next) => {
  setTimeout(() => {
    next();
  }, parseInt(LATENCY));
});

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

app.use(cookieParser());

// Serverless functions have no boot step, so connect on first request.
app.use(async (_, __, next) => {
  try {
    await connection.ensure();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(passport.initialize());

// OAuth is optional: strategies throw without credentials.
const googleEnabled = !!(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);
const facebookEnabled = !!(
  process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET
);

if (googleEnabled) configureGoogleAuth();

if (facebookEnabled) configureFacebookAuth();

app.use("/v1/books", bookRouter);
app.use("/v1/images", imageRouter);
app.use("/v1/languages", languageRouter);

app.use("/v1/user", userRouter);

app.use("/v1/chats", chatRouter);

app.get("/v1/auth/providers", (_, res) => {
  res.status(200).json({
    status: "success",
    data: { google: googleEnabled, facebook: facebookEnabled },
  });
});

if (googleEnabled) app.use("/v1/auth/google", googleAuthRouter);

if (facebookEnabled) app.use("/v1/auth/facebook", facebookAuthRouter);

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
