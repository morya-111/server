import "reflect-metadata";
import { config } from "dotenv";
config();
import app from "./app";
import { createConnection } from "typeorm";

const { PORT = 4000 } = process.env;

(async () => {
	await createConnection();

	app.listen(PORT, () => {
		console.log(`[SERVER STARTED] on http://localhost:${PORT}`);
	});
})().catch((err) => {
	console.log(err);
});
