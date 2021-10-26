import { Router } from "express";
import { newImage, getImageById } from "../controllers/imageController";
const imageRouter = Router();
import multer from "multer";

const upload = multer();
imageRouter.post("/newImage", upload.single("mainImage"), newImage);

imageRouter.get("/:imageId", getImageById);

export default imageRouter;
