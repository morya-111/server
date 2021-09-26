import express, { json } from "express";
import morgan from "morgan";
import bookRouter from "./routes/bookRoutes";
import imageRouter from "./routes/imageRoutes";
const app = express();

const { LATENCY = "0" } = process.env;

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(json());
app.use((_, __, next) => {
  setTimeout(() => {
    next();
  }, parseInt(LATENCY));
});

app.use("/books", bookRouter);
app.use("/images", imageRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
  });
});

export default app;
