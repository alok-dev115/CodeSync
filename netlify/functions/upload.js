import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const form = new formidable.IncomingForm({
    uploadDir: "/tmp",
    keepExtensions: true,
    multiples: false,
  });

  return new Promise((resolve) => {
    form.parse(event, async (err, fields, files) => {
      if (err) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: "File parse error" }),
        });
        return;
      }

      // 🔥 IMPORTANT FIX: formidable may return arrays
      const file = Array.isArray(files.image)
        ? files.image[0]
        : files.image;

      if (!file || !file.filepath) {
        resolve({
          statusCode: 400,
          body: JSON.stringify({ error: "No image file received" }),
        });
        return;
      }

      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "report-images",
          quality: "auto",
          fetch_format: "auto",
        });

        // Cleanup temp file
        fs.unlinkSync(file.filepath);

        resolve({
          statusCode: 200,
          body: JSON.stringify({
            imageUrl: result.secure_url,
          }),
        });
      } catch (e) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({
            error: e.message || "Cloudinary upload failed",
          }),
        });
      }
    });
  });
};
