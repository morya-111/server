import { RequestHandler } from "express";
import { Image } from "../entity/Image";
import AppError from "../utils/AppError";
import { uploadToStorage } from "../utils/supabase";

const EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const newImage: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError("No image provided", 400));

    const extension = EXTENSIONS[req.file.mimetype];
    if (!extension) return next(new AppError("Unsupported image type", 400));

    const url = await uploadToStorage(
      req.file.buffer,
      req.file.mimetype,
      extension
    );

    const newImage = Image.create({ url, label: null });
    await Image.save(newImage);

    res.status(200).json({
      msg: "success",
      data: {
        newImage,
      },
    });
  } catch (error) {
    console.log("Image upload failed", error?.response?.data || error);
    next(
      new AppError("Internal Server Error, Check server logs if possible", 500)
    );
  }
};

export const getImageById: RequestHandler = async (req, res, next) => {
  let imageId = req.params.imageId;
  const image = await Image.findOne({ where: { id: imageId } });

  if (!image) {
    return next(new AppError("Image Not Found", 404));
  }
  res.status(200).json({
    msg: "success",
    data: {
      image,
    },
  });
};
