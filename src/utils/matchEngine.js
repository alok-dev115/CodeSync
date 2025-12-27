import { timeConfidence } from "./timeConfidence";
import { cosineSimilarity } from "./vectorSimilarity";
import { textSimilarity } from "./textSimilarity"; // optional fallback

export const calculateMatchScore = (lost, found) => {
    if (
        !lost.textEmbedding ||
        !found.textEmbedding
    ) {
        return 0;
    }

    if (!lost.lostAt || !found.foundAt) return null;

    const timeScore = timeConfidence(
        lost.lostAt.toDate(),
        found.foundAt.toDate()
    );

    // 🔥 VECTOR-BASED TEXT MATCH
    let textScore = 0;

    if (lost.textEmbedding && found.textEmbedding) {
        const cosine = cosineSimilarity(
            lost.textEmbedding,
            found.textEmbedding
        );

        textScore = Math.max(0, cosine) * 100;
    } else {
        // fallback (optional)
        textScore = textSimilarity(
            lost.itemName,
            found.itemName
        );
    }

    const locationScore = textSimilarity(
        lost.location,
        found.location
    );

    return {
        finalScore: Math.round(
            0.4 * timeScore +
            0.4 * textScore +
            0.2 * locationScore
        ),
        timeScore: Math.round(timeScore),
        nameScore: Math.round(textScore),
        locationScore: Math.round(locationScore),
    };
};