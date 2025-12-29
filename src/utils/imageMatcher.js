import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

// Helper: Converts image URL to base64 for Gemini
async function urlToGenerativePart(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({
        inlineData: { data: reader.result.split(',')[1], mimeType: blob.type },
      });
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image:", error);
    return null;
  }
}

export async function compareImages(image1Url, image2Url) {
  if (!image1Url || !image2Url) return { similarityScore: 0, reason: "Missing image" };

  try {
    // 🔴 USING GEMINI 1.5 PRO (Supports images + widely available)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    const prompt = `
      You are a Lost & Found expert. Compare these two images.
      Focus on: Object type, brand, color, unique markings, and shape.
      Ignore: Lighting and background.
      Return JSON ONLY: { "similarityScore": number (0-100), "reason": "short text" }
    `;

    const img1 = await urlToGenerativePart(image1Url);
    const img2 = await urlToGenerativePart(image2Url);

    if (!img1 || !img2) return { similarityScore: 0, reason: "Image fetch failed" };

    const result = await model.generateContent([prompt, img1, img2]);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Gemini Scan Failed:", error);
    return { similarityScore: 0, reason: "AI Error: " + error.message };
  }
}