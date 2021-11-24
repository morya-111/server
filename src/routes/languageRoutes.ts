import { Router } from "express";
import { getAllLanguages } from "../controllers/languageController";
const languageRouter = Router();

languageRouter.get("/", getAllLanguages);

export default languageRouter;
