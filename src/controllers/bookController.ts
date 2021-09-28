import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Book } from "../entity/Book";

// const bookRepo = connection.getRepository(Book).find();

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const connection = getConnection();
    console.log("Requested All Books");

    const allBooks = await connection.getRepository(Book).find();
    console.log(allBooks);
    res.status(200).json({
      ...allBooks,
    });
  } catch (error) {
    console.log(error);
  }
};

export const newBook = async (req: Request, res: Response) => {
  try {
    console.log("Posted A New Book");
    const connection = getConnection();

    const book = new Book();

    // console.log(req);

    book.name = req.body.name;
    book.author = req.body.author;
    book.language = req.body.language;
    book.publisher = req.body.publisher;
    book.description = req.body.description;

    await connection.getRepository(Book).save(book);

    res.status(200).json({
      msg: "Book posted into db",
      data: book,
    });
  } catch (error) {
    console.log(error);
  }
};
