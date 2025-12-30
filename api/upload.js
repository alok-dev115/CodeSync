import { v2 as cloudinary } from "cloudinary";
import Busboy from "busboy";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // ✅ FIXED
  api_key: process.env.CLOUDINARY_API_KEY,       // ✅ FIXED
  api_secret: process.env.CLOUDINARY_API_SECRET, // ✅ FIXED
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const busboy = Busboy({ headers: req.headers });
  let fileBuffer = null;

  busboy.on("file", (name, file) => {
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
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "report-images",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(fileBuffer);
      });

      return res.status(200).json({
        imageUrl: uploadResult.secure_url,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }
  });

  req.pipe(busboy);
}
