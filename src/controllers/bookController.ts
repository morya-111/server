import { Request, Response, RequestHandler } from "express";
// import { getConnection } from "typeorm";
import { Book } from "../entity/Book";

// const bookRepo = connection.getRepository(Book).find();

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    console.log("Requested All Books");

    const allBooks = await Book.find();

    res.status(200).json({
      ...allBooks,
    });
  } catch (error) {
    console.log(error);
  }
};

export const newBook: RequestHandler = async (req: Request, res: Response) => {
  try {
    console.log("Posted A New Book");

    const book = Book.create({ ...req.body });

    await Book.save(book);

    res.status(200).json({
      msg: "Book posted into db",
      data: book,
    });
  } catch (error) {
    console.log(error);
  }
};
