import { Request, Response, RequestHandler } from "express";
import { IncomingMessage } from "http";
import FormData from "form-data";
import { Image } from "../entity/Image";
import { ImgBBMainResType } from "../types/ImgBBResTypes";
import { Book } from "../entity/Book";
import AppError from "../utils/AppError";

const UPLOAD_URL: String = "https://api.imgbb.com/1/upload";

export const newImage: RequestHandler = async (req, res, next) => {
  const seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  console.log(`Image Upload Started, Temp Sequence Number : ${seq}`);

  const imgString = req.file.buffer.toString("base64"); // console.log(imgbbrespone);

  const formData = new FormData();
  formData.append("key", process.env.IMGBB_KEY);
  formData.append("image", imgString);

  let imgBBMainResponse: ImgBBMainResType;
  let imgDetails;

  formData.submit(
    `${UPLOAD_URL}?key=${process.env.IMGBB_KEY}`,
    (err, imgBBres: IncomingMessage) => {
      let d: string = "";
      imgBBres.on("close", (r: IncomingMessage) => {
        console.log("Closed ImgBB HTTP Connection :", seq);
      });
      imgBBres.on("data", (chunk: string) => {
        console.log("New data recieved on : ", seq);
        d = d + chunk;
      });
      imgBBres.on("end", async () => {
        console.log(`Image Upload Complete: ${seq} : ${JSON.parse(d)}`);

        imgBBMainResponse = JSON.parse(d);

        if (imgBBMainResponse.status === 200) {
          // cleaning response object
          imgDetails = {
            imgBBid: imgBBMainResponse.data.id,
            imgBBtitle: imgBBMainResponse.data.title,
            imgBBurl: imgBBMainResponse.data.url,
            extension: imgBBMainResponse.data.image.extension,
          };
          const book = await Book.findOne({ id: req.body.bookId });
          const newImage = Image.create({
            url: imgDetails.imgBBurl as string,
            label: null,
            book: book,
          });

          await Image.save(newImage);
          console.log(`Image ${seq} Posted successfully `);

          res.status(200).json({
            msg: "success",
            data: {
              newImage,
            },
          });
        } else {
          console.log(`Server Image Upload Failed for ${seq}`, imgBBMainResponse);

          return next(new AppError("Internal Server Error, Check server logs if possible", 500));
        }
      });
    }
  );
};

export const getImageById: RequestHandler = async (req, res, next) => {
  console.log(req.params);
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
