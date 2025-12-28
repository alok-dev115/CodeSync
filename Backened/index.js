import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("Backend running on port 5000");
});

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer config
const upload = multer({ dest: "uploads/" });

// Upload route
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log("Upload hit");
    console.log("File received:", req.file);

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "report-images",
      quality: "auto",
      fetch_format: "auto",
      transformation: [
        {
          width: 1024,
          height: 1024,
          crop: "limit",
        },
      ],
    });

    fs.unlinkSync(req.file.path);

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Server start (VERY IMPORTANT: LAST LINE)
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
