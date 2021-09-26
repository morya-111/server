import { Request, Response, RequestHandler } from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

let imgbbrespone = null;
export const newImage: RequestHandler = async (req, resMain) => {
  try {
    const imgBBkey = "e6b8a5455a0eba8a1aca625a29c8d415";
    var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    console.log("New Image Upload Started - ", seq);

    const encodedImage = req.file.buffer.toString("base64"); // console.log(imgbbrespone);

    const formData = new FormData();
    formData.append("key", imgBBkey);
    formData.append("image", encodedImage);
    // const config = {
    //   headers: {
    //     "content-type": "multipart/form-data",
    //   },
    // };
    formData.submit(`https://api.imgbb.com/1/upload?key=${imgBBkey}`, (err, imgBBres) => {
      // console.log(err);
      // console.log(imgBBres.statusCode);
      let d: ArrayBuffer;
      imgBBres.on("close", (r: any) => {
        console.log("Closed ImgBB HTTP Connection :", seq);
      });
      imgBBres.on("data", (chunk: any) => {
        console.log("New data received on : ", seq);
        d = d + chunk;
      });
      imgBBres.on("end", () => {
        console.log(JSON.parse(d.toString().slice(9)));
        const imgbbresponse = JSON.parse(d.toString().slice(9));

        resMain.status(200).json({
          msg: "received",
          imgbbresponse,
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const newImage64: RequestHandler = async (req, res) => {
  try {
    console.log(req.body);

    imgbbrespone = await axios.post("https://api.imgbb.com/1/upload", {
      // key: imgBBkey,
      image: req.body.mainImage,
      name: "testImage",
    });

    res.status(200).json({
      msg: "received",
      imgbbrespone,
    });
  } catch (error) {
    console.log(error.response);
    console.log(imgbbrespone);
  }
};
