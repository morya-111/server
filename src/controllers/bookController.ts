import { isInt, validate } from "class-validator";
import { Request, Response, RequestHandler } from "express";
import { Book } from "../entity/Book";
import { RentListing } from "../entity/RentListing";
import { SellListing } from "../entity/SellListing";
import { User } from "../entity/User";
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
    console.log(error);
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
    relations: ["language", "image", "sellListing", "rentListing"],
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
