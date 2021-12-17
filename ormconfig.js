const {
  NODE_ENV = "development",
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_URL,
  TEST_DATABASE_NAME = DATABASE_NAME,
  TEST_DATABASE_HOST = DATABASE_HOST,
  TEST_DATABASE_PORT = DATABASE_PORT,
  TEST_DATABASE_USERNAME = DATABASE_USERNAME,
  TEST_DATABASE_PASSWORD = DATABASE_PASSWORD,
  TEST_DATABASE_URL = DATABASE_URL,
} = process.env;

module.exports = {
  type: "postgres",
  host: NODE_ENV === "test" ? TEST_DATABASE_HOST : DATABASE_HOST,
  port: NODE_ENV === "test" ? TEST_DATABASE_PORT : DATABASE_PORT,
  username: NODE_ENV === "test" ? TEST_DATABASE_USERNAME : DATABASE_USERNAME,
  password: NODE_ENV === "test" ? TEST_DATABASE_PASSWORD : DATABASE_PASSWORD,
  database: NODE_ENV === "test" ? TEST_DATABASE_NAME : DATABASE_NAME,
  url: NODE_ENV === "test" ? TEST_DATABASE_URL : DATABASE_URL,
  synchronize: true,
  logging: NODE_ENV === "development",
  entities: [
    NODE_ENV === "production" ? "dist/entity/**/*.js" : "src/entity/**/*.ts",
  ],
  dropSchema: NODE_ENV === "test",
  // dropSchema: true,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
};
