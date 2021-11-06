import { Router } from "express";
import { getAllBooks, newBook } from "../controllers/bookController";
const bookRouter = Router();

bookRouter.get("/", getAllBooks);
bookRouter.post("/", newBook);

export default bookRouter;
