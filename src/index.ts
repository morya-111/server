import { config } from "dotenv";
config();
import app from "./app";

const { PORT = 4000 } = process.env;

(async () => {
	app.listen(PORT, () => {
		console.log(`[SERVER STARTED] on http://localhost:${PORT}`);
	});
})().catch((err) => {
	console.log(err);
});
