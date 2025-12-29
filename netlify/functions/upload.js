import { v2 as cloudinary } from "cloudinary";
import Busboy from "busboy";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  return new Promise((resolve) => {
    const contentType =
      event.headers["content-type"] || event.headers["Content-Type"];

    if (!contentType) {
      resolve({
        statusCode: 400,
        body: JSON.stringify({ error: "Missing Content-Type header" }),
      });
      return;
    }

    const busboy = new Busboy({ headers: { "content-type": contentType } });

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
        resolve({
          statusCode: 400,
          body: JSON.stringify({ error: "No image uploaded" }),
        });
        return;
      }

      try {
        const uploadResult = await new Promise((res, rej) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "report-images",
                resource_type: "image",
                quality: "auto",
                fetch_format: "auto",
              },
              (err, result) => {
                if (err) rej(err);
                else res(result);
              }
            )
            .end(fileBuffer);
        });

        resolve({
          statusCode: 200,
          body: JSON.stringify({ imageUrl: uploadResult.secure_url }),
        });
      } catch (err) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: err.message }),
        });
      }
    });

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : Buffer.from(event.body);

    busboy.end(body);
  });
};
