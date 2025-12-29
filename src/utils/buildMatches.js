import { compareImages } from "./imageMatcher";

/**
 * 🔥 Main Matching Engine
 * - Phase 1: Fast pre-filter (text + location + time)
 * - Phase 2: Auto image scan on top candidates
 * - Phase 3: Final weighted score & UI-ready output
 */
export const buildMatches = async (lostItems, foundItems) => {
  const candidates = [];

  // 1️⃣ Base scoring pass (cheap operations only)
  for (const lost of lostItems) {
    for (const found of foundItems) {
      const textScore = cosineSimilarity(
        lost.textEmbedding,
        found.textEmbedding
      );

      const locScore = locationScore(lost.location, found.location);
      const timeScoreVal = timeScore(lost.lostAt, found.foundAt);

      // Base score (used ONLY for filtering & ranking)
      const baseScore =
        textScore * 60 +
        locScore * 25 +
        timeScoreVal * 15;

      if (baseScore >= 30) {
        candidates.push({
          lost,
          found,

          lostImage: lost.image || lost.imageUrl || lost.img || null,
          foundImage: found.image || found.imageUrl || found.img || null,

          textScore,
          locScore,
          timeScore: timeScoreVal,
          baseScore,

          imageScore: 0,
          isScanned: false,
        });
      }
    }
  }

  // 2️⃣ Sort candidates by base score
  candidates.sort((a, b) => b.baseScore - a.baseScore);

  // 3️⃣ Auto image scan (Top 5 only)
  const topMatches = candidates.slice(0, 5);

  for (const match of topMatches) {
    if (match.lostImage && match.foundImage) {
      try {
        const aiResult = await compareImages(
          match.lostImage,
          match.foundImage
        );

        match.imageScore = aiResult.similarityScore / 100; // normalize
        match.isScanned = true;
      } catch (err) {
        console.error("Image scan failed:", err);
      }
    }
  }

  // 4️⃣ Final scoring & UI formatting
  return candidates
    .map((m) => {
      let finalScore = m.baseScore;

      if (m.isScanned) {
        // Refined AI-weighted score
        finalScore =
          m.textScore * 40 +
          m.imageScore * 30 +
          m.locScore * 20 +
          m.timeScore * 10;
      }

      return {
        lostItem: m.lost.itemName,
        foundItem: m.found.itemName,

        lostItemImage: m.lostImage,
        foundItemImage: m.foundImage,

        rawLostItem: m.lost,
        rawFoundItem: m.found,

        score: finalScore,
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
