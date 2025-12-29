import { v2 as cloudinary } from "cloudinary";
import Busboy from "busboy";

export const config = {
  api: {
    bodyParser: false, // REQUIRED for file uploads
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const busboy = new Busboy({ headers: req.headers });

  let fileBuffer = null;

  busboy.on("file", (_, file) => {
    const chunks = [];
    file.on("data", (data) => chunks.push(data));
    file.on("end", () => {
      fileBuffer = Buffer.concat(chunks);
    });
  });

  busboy.on("finish", async () => {
    if (!fileBuffer) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "report-images",
              resource_type: "image",
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          )
          .end(fileBuffer);
      });

      return res.status(200).json({ imageUrl: result.secure_url });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  req.pipe(busboy);
}
