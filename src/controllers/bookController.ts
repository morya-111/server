import { Request, Response, RequestHandler } from "express";
import { Book } from "../entity/Book";
import ApiFeatures from "../utils/ApiFeatures";

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    console.log("Requested All Books");

    const features = new ApiFeatures(req.query, {
      ordering: false,
      select: false,
    });

    const books = await Book.findAndCount({
      ...features.builtQuery,
      relations: ["language", "images"],
    });

    res.status(200).json({
      status: "success",
      data: {
        books: books[0],
        pagination: features.paginationInfo(books[1]),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const newBook: RequestHandler = async (req: Request, res: Response) => {
  try {
    const book = Book.create({ ...req.body });

    await Book.save(book);

    console.log(`Posted A New Book :  ${req.body.name}`);
    res.status(200).json({
      msg: "Book posted into db",
      data: book,
    });
  } catch (error) {
    console.log(error);
  }
};
