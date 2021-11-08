import fs from "fs";
import path from "path";
import * as csv from "@fast-csv/parse";
import connection from "./connection";
import { Image } from "./entity/Image";
import { Book } from "./entity/Book";
import { Language } from "./entity/Language";

const MAX_ROWS_TO_INSERT = 100;

const GENRE = [
  "adventure",
  "classics",
  "comic book",
  "mystery",
  "fantasy",
  "historical fiction",
  "horror",
  "literary fiction",
  "romance",
  "science fiction",
  "short stories",
  "suspense",
  "non fiction",
  "history",
  "memoir",
  "poetry",
  "self help",
];

const LANGUAGES = ["english", "marathi", "french", "spanish", "tamil", "urdu"];

(async () => {
  await connection.create();

  await connection.clear();

  const languageObjects = [];

  for (let i = 0; i < LANGUAGES.length; i++) {
    const element = LANGUAGES[i];
    const lang = await Language.create({ name: element }).save();

    languageObjects.push(lang);
  }

  const stream = fs
    .createReadStream(path.resolve(__dirname, "../dev-data/500-books.csv"))
    .pipe(csv.parse({ headers: true, maxRows: MAX_ROWS_TO_INSERT }))
    .on("error", async (error) => {
      console.error(error);
      await connection.close();
    })
    .on("data", async (row) => {
      try {
        stream.pause();
        const book = await Book.create({
          name: row.name,
          author: row.author,
          publisher: row.publication,
          description: row.description === "" ? null : row.description,
          genre: GENRE[Math.floor(Math.random() * GENRE.length)],
          language:
            languageObjects[Math.floor(Math.random() * languageObjects.length)],
        }).save();

        await Image.create({ book, url: row.img }).save();
      } finally {
        stream.resume();
      }
    })
    .on("end", async () => {
      setTimeout(async () => {
        await connection.close();
      }, 3000);
    });
})();
