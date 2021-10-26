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

// Just An Example for understanding
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

export { ImgBBMainResType };
