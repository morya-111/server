import { Router } from "express";
import {
  getAllBooks,
  newBook,
  getBookById,
} from "../controllers/bookController";
const bookRouter = Router();

bookRouter.get("/", getAllBooks).get("/:id", getBookById);
bookRouter.post("/", newBook);

export default bookRouter;
