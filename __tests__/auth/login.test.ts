import faker from "faker";
import supertest from "supertest";
import app from "../../src/app";
import { User } from "../../src/entity/User";
import { Auth } from "../../src/entity/Auth";

const request = supertest(app);

describe("POST /v1/user/login", () => {
	const loginInput = {
		email: faker.internet.email(),
		password: faker.internet.password(10),
	};

	beforeEach(async () => {
		const user = await User.create({
			email: loginInput.email,
			first_name: faker.name.firstName(),
			last_name: faker.name.lastName(),
			role: "INDIVIDUAL",
		}).save();
		await Auth.create({
			password: loginInput.password,
			user,
		}).save();
	});

	describe("given valid values", () => {
		test("should return status 200", async () => {
			const res = await request.post("/v1/user/login").send(loginInput);
			expect(res.statusCode).toBe(200);
		});

		test("should return content type json", async () => {
			const res = await request.post("/v1/user/login").send(loginInput);
			expect(res.headers["content-type"]).toEqual(
				expect.stringContaining("json")
			);
		});

		test("should return user data", async () => {
			const res = await request.post("/v1/user/login").send(loginInput);
			expect(res.body.data.user).toBeDefined();
		});

		test("should set cookie", async () => {
			const res = await request.post("/v1/user/login").send(loginInput);
			expect(res.headers["set-cookie"][0]).toEqual(
				expect.stringContaining("jwt")
			);
		});
	});

	describe("given invalid values", () => {
		test("should return status 400 email not given", async () => {
			const res = await request
				.post("/v1/user/login")
				.send({ ...loginInput, email: undefined });

			expect(res.statusCode).toBe(400);
		});

		test("should return status 400 password not given", async () => {
			const res = await request
				.post("/v1/user/login")
				.send({ ...loginInput, password: undefined });

			expect(res.statusCode).toBe(400);
		});

		test("should return status 401 incorrect email ", async () => {
			const res = await request
				.post("/v1/user/login")
				.send({ ...loginInput, email: faker.internet.email() });

			expect(res.statusCode).toBe(401);
		});

		test("should return status 401 incorrect password ", async () => {
			const res = await request
				.post("/v1/user/login")
				.send({ ...loginInput, password: faker.internet.password(12) });

			expect(res.statusCode).toBe(401);
		});

		test("should return status 403 for email with social login", async () => {
			const socialLoginInput = {
				first_name: faker.name.firstName(),
				last_name: faker.name.lastName(),
				email: faker.internet.email(),
				google_id: "890789",
			};

			const user = await User.create({
				email: socialLoginInput.email,
				first_name: socialLoginInput.first_name,
				last_name: socialLoginInput.last_name,
				role: "INDIVIDUAL",
			}).save();
			await Auth.create({
				google_id: socialLoginInput.google_id,
				user,
			}).save();

			const res = await request.post("/v1/user/login").send({
				email: socialLoginInput.email,
				password: faker.internet.password(10),
			});

			expect(res.statusCode).toBe(403);
		});
	});
});
