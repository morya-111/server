import express from "express";
import morgan from "morgan";

const app = express();

const { LATENCY = "0" } = process.env;

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use((_, __, next) => {
	setTimeout(() => {
		next();
	}, parseInt(LATENCY));
});

app.get("/", (req, res) => {
	res.status(200).json({
		status: "success",
	});
});

export default app;
