import { Router } from "express";
import {
  getAllBooks,
  newBook,
  getBookById,
  getAllBooksByLoggedInUser,
  deleteBook,
} from "../controllers/bookController";

import { protect } from "../controllers/authController";

const bookRouter = Router();

bookRouter.get("/mybooks", protect(), getAllBooksByLoggedInUser);
bookRouter.get("/", getAllBooks).get("/:id", getBookById);
bookRouter.post("/", protect(), newBook).delete("/:id", deleteBook);

export default bookRouter;
