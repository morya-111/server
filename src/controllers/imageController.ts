import { Request, Response, RequestHandler } from "express";
import { IncomingMessage } from "http";
import FormData from "form-data";
import { Image } from "../entity/Image";
// import multer from "multer";
import imgBBclient from "./../Utils/ImgBBClient";
import { Book } from "../entity/Book";

const UPLOAD_URL: String = "https://api.imgbb.com/1/upload";

export const newImage: RequestHandler = async (req, res) => {
  try {
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
            console.log(`Image ${seq} successfully `);

            res.status(200).json({
              msg: "success",
              data: {
                newImage,
              },
            });
          } else {
            console.log(`Server Image Upload Error for ${seq}`, imgBBMainResponse);

            console.log(
              "Error Occurred While uploading the image to imgBB, toggle console log right above this line "
            );
            res.status(500).json({ msg: "Internal Server Error, Check server logs if possible" });
          }
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
type ImgBBMainResType = {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    size: number;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
};
const sampleres: ImgBBMainResType = {
  data: {
    id: "r075Cq1",
    title: "5937b9f8d4f5",
    url_viewer: "https://ibb.co/r075Cq1",
    url: "https://i.ibb.co/wg0p98x/5937b9f8d4f5.png",
    display_url: "https://i.ibb.co/wg0p98x/5937b9f8d4f5.png",
    size: 787,
    time: "1632772911",
    expiration: "0",
    image: {
      filename: "5937b9f8d4f5.png",
      name: "5937b9f8d4f5",
      mime: "image/png",
      extension: "png",
      url: "https://i.ibb.co/wg0p98x/5937b9f8d4f5.png",
    },
    thumb: {
      filename: "5937b9f8d4f5.png",
      name: "5937b9f8d4f5",
      mime: "image/png",
      extension: "png",
      url: "https://i.ibb.co/r075Cq1/5937b9f8d4f5.png",
    },
    delete_url: "https://ibb.co/r075Cq1/6ca0f3f70e74cb52ce9b4e97ba48d57e",
  },
  success: true,
  status: 200,
};
