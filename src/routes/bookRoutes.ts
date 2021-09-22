import { Router } from "express";
import { getAllBooks, newBook } from "../controllers/bookController";
const bookRouter = Router();

bookRouter.get("/allBooks", getAllBooks);
bookRouter.post("/newbook", newBook);

export default bookRouter;
