import "reflect-metadata";
import { config } from "dotenv";
config();
import app from "./app";

const { PORT = 4000, LATENCY = "0" } = process.env;

// On Vercel the app is imported as a function; locally we listen.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[SERVER STARTED] on http://localhost:${PORT}`);
    console.log(`[LATENCY] ${LATENCY} ms`);
  });
}

export default app;
