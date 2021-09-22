import "reflect-metadata";
import { config } from "dotenv";
config();
import app from "./app";
import { createConnection } from "typeorm";
import { Book } from "./entity/Book";
import bookRouter from "./routes/bookRoutes";
const { PORT = 4000 } = process.env;

(async () => {
  const connection = await createConnection();

  app.listen(PORT, () => {
    console.log(`[SERVER STARTED] on http://localhost:${PORT}`);
  });

  // const book1 = {
  //   name: "Zero to One",
  //   description: "That rare thing : a concise, thought-provoking book on entrepreneurship",
  //   language: "English",
  //   publisher: "Penguin Random House UK",
  //   author: "Peter Thiel",
  // };

  // let book = new Book();
  // book.name = book1.name;
  // book.description = book1.description;
  // book.language = book1.language;
  // book.publisher = book1.publisher;
  // book.author = book1.author;

  // const savedBook = await connection.manager.save(book);

  // console.log(savedBook);

  console.log("");
})().catch((err) => {
  console.log(err);
});
