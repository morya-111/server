import { ConnectionOptions } from "typeorm";
import { Address } from "./entity/Address";
import { Auth } from "./entity/Auth";
import { Book } from "./entity/Book";
import { Chat } from "./entity/Chat";
import { Image } from "./entity/Image";
import { Language } from "./entity/Language";
import { Participant } from "./entity/Participant";
import { RentListing } from "./entity/RentListing";
import { Room } from "./entity/Room";
import { SellListing } from "./entity/SellListing";
import { User } from "./entity/User";

const {
  NODE_ENV = "development",
  DATABASE_URL,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  TEST_DATABASE_URL = DATABASE_URL,
  TEST_DATABASE_HOST = DATABASE_HOST,
  TEST_DATABASE_PORT = DATABASE_PORT,
  TEST_DATABASE_USERNAME = DATABASE_USERNAME,
  TEST_DATABASE_PASSWORD = DATABASE_PASSWORD,
  TEST_DATABASE_NAME = DATABASE_NAME,
  DB_SYNC,
} = process.env;

const isTest = NODE_ENV === "test";
const url = isTest ? TEST_DATABASE_URL : DATABASE_URL;

// Hosted Postgres (Supabase) needs SSL; a local Postgres usually doesn't.
const isRemote = !!url && !/localhost|127\.0\.0\.1/.test(url);

// Schema sync on every cold start is slow and racy on serverless, so it's
// opt-in outside dev/test. Run `yarn db:sync` once against Supabase instead.
const synchronize =
  DB_SYNC !== undefined ? DB_SYNC === "true" : NODE_ENV !== "production";

const dbConfig: ConnectionOptions = {
  type: "postgres",
  url,
  host: isTest ? TEST_DATABASE_HOST : DATABASE_HOST,
  port: parseInt((isTest ? TEST_DATABASE_PORT : DATABASE_PORT) || "5432"),
  username: isTest ? TEST_DATABASE_USERNAME : DATABASE_USERNAME,
  password: isTest ? TEST_DATABASE_PASSWORD : DATABASE_PASSWORD,
  database: isTest ? TEST_DATABASE_NAME : DATABASE_NAME,
  entities: [
    Address,
    Auth,
    Book,
    Chat,
    Image,
    Language,
    Participant,
    RentListing,
    Room,
    SellListing,
    User,
  ],
  synchronize,
  dropSchema: isTest,
  logging: NODE_ENV === "development" ? ["error", "schema"] : ["error"],
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  // keep the pool small: each serverless instance holds its own
  extra: { max: parseInt(process.env.DB_POOL_MAX || "3") },
};

export default dbConfig;
