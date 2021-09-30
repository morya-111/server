import { Image } from "../entity/Image";
import { Book } from "../entity/Book";

class ImgBBClient {
  imgBBkey: String;
  constructor() {
    this.imgBBkey = process.env.IMGBB_KEY;
  }

  async uploadImage(imgString: String, bookId: number) {}
}

const imgBBclient = new ImgBBClient();

export default imgBBclient;
