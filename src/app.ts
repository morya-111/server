import express, { json } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
import bookRouter from "./routes/bookRoutes";
import userRouter from "./routes/userRoutes";
import googleAuthRouter from "./routes/googleAuthRoutes";
import facebookAuthRouter from "./routes/facebookAuthRoutes";
import globalErrorhandler from "./controllers/errorController";
import { protect } from "./controllers/authController";
import configureGoogleAuth from "./utils/configureGoogleAuth";
import configureFacebookAuth from "./utils/configureFacebookAuth";

const app = express();

const { LATENCY = "0" } = process.env;

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

app.use("/books", bookRouter);

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
