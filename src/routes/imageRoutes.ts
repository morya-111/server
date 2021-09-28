import { Router } from "express";
import { newImage } from "../controllers/imageController";
const imageRouter = Router();
import multer from "multer";

// const upload = multer({ dest: "/uploads" });
const upload = multer();
imageRouter.post("/newImage", upload.single("mainImage"), newImage);
// imageRouter.post("/newImage64", newImage64);
// imageRouter.post("/newbook", );

export default imageRouter;
