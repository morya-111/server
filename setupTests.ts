import connection from "./src/connection";

beforeEach(async () => {
	await connection.create();
});

afterEach(async () => {
	await connection.close();
});
