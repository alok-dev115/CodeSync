export const buildMatches = (lostItems, foundItems) => {
    const matches = [];

    for (const lost of lostItems) {
        for (const found of foundItems) {
            // 1️⃣ TEXT SIMILARITY
            const textSim = cosineSimilarity(
                lost.textEmbedding,
                found.textEmbedding
            );

            // 2️⃣ LOCATION MATCH
            const locScore = locationScore(
                lost.location,
                found.location
            );

            // 3️⃣ TIME PROXIMITY
            const tScore = timeScore(
                lost.lostAt,
                found.foundAt
            );

            // 🔥 FINAL WEIGHTED SCORE
            const finalScore =
                textSim * 60 +
                locScore * 25 +
                tScore * 15;

            // Threshold to avoid junk matches
            if (finalScore >= 50) {
                matches.push({
                    lostItem: lost.itemName,
                    foundItem: found.itemName,
                    score: finalScore,
                    breakdown: {
                        text: Math.round(textSim * 60),
                        location: Math.round(locScore * 25),
                        time: Math.round(tScore * 15),
                    },
                });
            }
        }
    }

    // Sort best match first
    matches.sort((a, b) => b.score - a.score);

    return matches;
};

// ===== Helpers =====

const cosineSimilarity = (a, b) => {
    if (!a || !b) return 0;
    if (a.length !== b.length) return 0;

    let dot = 0, normA = 0, normB = 0;

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
    return l1.toLowerCase() === l2.toLowerCase() ? 1 : 0;
};

const timeScore = (lostAt, foundAt) => {
    if (!lostAt || !foundAt) return 0;

    const diffHours =
        Math.abs(foundAt.toDate() - lostAt.toDate()) / (1000 * 60 * 60);

    if (diffHours <= 1) return 1;
    if (diffHours >= 24) return 0;

    return 1 - diffHours / 24;
};