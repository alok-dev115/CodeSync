import { compareImages } from "./imageMatcher";

/**
 * 🔥 Main Matching Engine
 * Phase 1: Text + Location + Time (cheap)
 * Phase 2: Auto Image Scan (Top 5 only)
 * Phase 3: Final Weighted Score
 */

// ✅ Helper to validate real image URLs
const isValidImageUrl = (url) => {
  return (
    typeof url === "string" &&
    (url.startsWith("http://") || url.startsWith("https://"))
  );
};

export const buildMatches = async (lostItems, foundItems) => {
  const candidates = [];

  // 1️⃣ BASE SCORING (FAST FILTER)
  for (const lost of lostItems) {
    for (const found of foundItems) {
      const textScore = cosineSimilarity(
        lost.textEmbedding,
        found.textEmbedding
      );

      const locScore = locationScore(lost.location, found.location);
      const timeScoreVal = timeScore(lost.lostAt, found.foundAt);

      const baseScore =
        textScore * 60 +
        locScore * 25 +
        timeScoreVal * 15;

      if (baseScore < 30) continue;

      // ✅ SAFELY extract image URLs
      const lostImage =
        isValidImageUrl(lost.imageUrl) ? lost.imageUrl : null;

      const foundImage =
        isValidImageUrl(found.imageUrl) ? found.imageUrl : null;

      candidates.push({
        lost,
        found,

        lostImage,
        foundImage,

        textScore,
        locScore,
        timeScore: timeScoreVal,
        baseScore,

        imageScore: 0,
        isScanned: false,
      });
    }
  }

  // 2️⃣ SORT BY BASE SCORE
  candidates.sort((a, b) => b.baseScore - a.baseScore);

  // 3️⃣ AUTO IMAGE SCAN (TOP 5 ONLY)
  const topMatches = candidates.slice(0, 5);

  for (const match of topMatches) {
    if (!match.lostImage || !match.foundImage) continue;

    try {
      const aiResult = await compareImages(
        match.lostImage,
        match.foundImage
      );

      match.imageScore = aiResult.similarityScore / 100;
      match.isScanned = true;
    } catch (err) {
      console.error("Image scan failed:", err);
    }
  }

  // 4️⃣ FINAL SCORE + UI FORMAT
  return candidates
    .map((m) => {
      let finalScore = m.baseScore;

      if (m.isScanned) {
        finalScore =
          m.textScore * 40 +
          m.imageScore * 30 +
          m.locScore * 20 +
          m.timeScore * 10;
      }

      return {
        lostItem: m.lost.itemName || "Unknown",
        foundItem: m.found.itemName || "Unknown",

        lostItemImage: m.lostImage,
        foundItemImage: m.foundImage,

        rawLostItem: m.lost,
        rawFoundItem: m.found,

        score: Math.round(finalScore),
        isScanned: m.isScanned,

        breakdown: {
          text: Math.round(m.textScore * 60),
          location: Math.round(m.locScore * 25),
          time: Math.round(m.timeScore * 15),
          image: m.isScanned
            ? Math.round(m.imageScore * 100)
            : null,
        },
      };
    })
    .sort((a, b) => b.score - a.score);
};

/* ================= HELPERS ================= */

const cosineSimilarity = (a, b) => {
  if (!a || !b || a.length !== b.length) return 0;

  let dot = 0,
    normA = 0,
    normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const locationScore = (l1, l2) => {
  if (!l1 || !l2) return 0;
  return l1.trim().toLowerCase() === l2.trim().toLowerCase() ? 1 : 0;
};

const timeScore = (lostAt, foundAt) => {
  if (!lostAt || !foundAt) return 0;

  const d1 = lostAt.toDate ? lostAt.toDate() : new Date(lostAt);
  const d2 = foundAt.toDate ? foundAt.toDate() : new Date(foundAt);

  const diffHours = Math.abs(d1 - d2) / (1000 * 60 * 60);

  if (diffHours <= 1) return 1;
  if (diffHours >= 24) return 0;

  return 1 - diffHours / 24;
};
