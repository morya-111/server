import { isInt, validate } from "class-validator";
import { Request, Response, RequestHandler } from "express";
import { ILike } from "typeorm";
import { Book } from "../entity/Book";
import { RentListing } from "../entity/RentListing";
import { SellListing } from "../entity/SellListing";
import ApiFeatures from "../utils/ApiFeatures";
import AppError from "../utils/AppError";
import merge from "lodash.merge";

export const getAllBooks = async (req: Request, res: Response, next) => {
  try {
    let searchObject;
    if (req.query.s) {
      searchObject = { where: { name: ILike(`%${req.query.s}%`) } };
      delete req.query.s;
    }

    const features = new ApiFeatures(req.query, {
      ordering: false,
      select: false,
    });

    const findOptions = merge(features.builtQuery, searchObject);

    const books = await Book.findAndCount({
      ...findOptions,
      relations: ["language", "image", "sellListing", "rentListing"],
    });

    res.status(200).json({
      status: "success",
      data: {
        books: books[0],
        pagination: features.paginationInfo(books[1]),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const newBook: RequestHandler = async (req, res, next) => {
  try {
    let sellListing;
    let rentListing;
    const {
      name,
      description,
      genre,
      author,
      publisher,
      language,
      image,
      price,
      deposit,
      fees,
      duration,
      durationUnit,
    } = req.body;

    console.log({ body: req.body });

    let book = Book.create({
      name,
      description,
      genre,
      author,
      publisher,
      language,
      image,
      user: req.user,
    });

    // validate book
    let errors = await validate(book);
    if (errors.length > 0)
      return next(new AppError("Validation Error", 400, errors));

    book = await book.save();

    if (price) {
      sellListing = SellListing.create({ price });

      // validate sellListing
      let errors = await validate(sellListing);
      if (errors.length > 0)
        return next(new AppError("Validation Error", 400, errors));

      sellListing.book = book;
      sellListing = await sellListing.save();
      sellListing.book = undefined;
    }

    if (deposit && fees && duration && durationUnit) {
      rentListing = RentListing.create({
        deposit,
        fees,
        duration,
        durationUnit,
      });

      // validate rentListing
      let errors = await validate(rentListing);
      if (errors.length > 0)
        return next(new AppError("Validation Error", 400, errors));

      rentListing.book = book;
      rentListing = await rentListing.save();
      rentListing.book = undefined;
    }

    res.status(200).json({
      msg: "Book posted into db",
      data: { book: { ...book, sellListing, rentListing } },
    });
  } catch (error) {
    next(error);
  }
};

export const getBookById: RequestHandler = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (!isInt(id)) {
    return next(new AppError("No book found with that id", 404));
  }

  const book = await Book.findOne(id, {
    relations: ["language", "image", "sellListing", "rentListing", "user"],
  });

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

export const getAllBooksByLoggedInUser: RequestHandler = async (
  req,
  res,
  next
) => {
  const books = await Book.find({
    where: { user: req.user },
    relations: ["language", "image", "sellListing", "rentListing"],
  });

  if (books && books.length == 0) {
    return next(new AppError("No books found by that user", 404));
  }

  return res.status(200).json({
    status: "success",
    data: { books },
  });
};

export const deleteBook: RequestHandler = async (req, res, next) => {
  const bookId = req.params.id;

  const bookDel = await Book.delete(bookId);
  console.log(bookDel);
  if (bookDel.affected == 0) {
    return next(new AppError("Book with that ID doesn't exist.", 404));
  }

  res.status(200).json({
    msg: "success",
  });
};
