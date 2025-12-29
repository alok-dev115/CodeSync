import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = "/tmp";
  form.keepExtensions = true;

  return new Promise((resolve) => {
    form.parse(event, async (err, fields, files) => {
      if (err) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: "File parse error" }),
        });
        return;
      }

      const file = files.image;

      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "report-images",
          quality: "auto",
          fetch_format: "auto",
        });

        fs.unlinkSync(file.filepath);

        resolve({
          statusCode: 200,
          body: JSON.stringify({ imageUrl: result.secure_url }),
        });
      } catch (e) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: e.message }),
        });
      }
    });
  });
};
