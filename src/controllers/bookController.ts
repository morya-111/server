import { isInt } from "class-validator";
import { Request, Response, RequestHandler } from "express";
import { Book } from "../entity/Book";
import ApiFeatures from "../utils/ApiFeatures";
import AppError from "../utils/AppError";

export const getAllBooks = async (req: Request, res: Response) => {
  try {
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

export const getBookById: RequestHandler = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (!isInt(id)) {
    return next(new AppError("No book found with that id", 404));
  }

  const book = await Book.findOne(id, { relations: ["language", "images"] });

  if (!book) {
    return next(new AppError("No book found with that id", 404));
  }
  return res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
};
