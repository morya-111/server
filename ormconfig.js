console.log("env", process.env.NODE_ENV);

const {
	NODE_ENV = "development",
	DATABASE_HOST,
	DATABASE_PORT,
	DATABASE_USERNAME,
	DATABASE_PASSWORD,
	DATABASE_NAME,
	DATABASE_URL,
} = process.env;

module.exports = {
	type: "postgres",
	host: DATABASE_HOST,
	port: DATABASE_PORT,
	username: DATABASE_USERNAME,
	password: DATABASE_PASSWORD,
	database: DATABASE_NAME,
	url: DATABASE_URL,
	synchronize: true,
	logging: NODE_ENV === "development",
	entities: ["src/entity/**/*.ts"],
};
