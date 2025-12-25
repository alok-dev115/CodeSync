const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();
const db = admin.firestore();

const genAI = new GoogleGenerativeAI(
  functions.config().gemini.key
);

exports.generateEmbedding = functions.https.onCall(
  async (data) => {
    const { text, collection, docId } = data;

    if (!text || !collection || !docId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing parameters"
      );
    }

    const model = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });

    const result = await model.embedContent(text);
    const embedding = result.embedding.values;

    await db.collection(collection).doc(docId).update({
      textEmbedding: embedding,
    });

    return { success: true };
  }
);
