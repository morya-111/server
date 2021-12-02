import "reflect-metadata";
import { config } from "dotenv";
config();
import app from "./app";
import { createConnection } from "typeorm";

const { PORT = 4000, LATENCY = "0" } = process.env;

(async () => {
  const connection = await createConnection();

  app.listen(PORT, () => {
    console.log(`[SERVER STARTED] on http://localhost:${PORT}`);
    console.log(`[LATENCY] ${LATENCY} ms`);
  });

  console.log("");
})().catch((err) => {
  console.log(err);
});
