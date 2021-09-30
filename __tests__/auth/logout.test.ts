import faker from "faker";
import supertest from "supertest";
import app from "../../src/app";

const request = supertest(app);

describe("POST /v1/user/logout", () => {
	test("should return 200 when user logout", async () => {
		const registerRes = await request.post("/v1/user/register").send({
			first_name: faker.name.firstName(),
			last_name: faker.name.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password(10),
		});
		const cookie = registerRes.headers["set-cookie"][0];

		const res = await request.post("/v1/user/logout").set("Cookie", [cookie]);

		expect(res.statusCode).toBe(200);
	});
});
