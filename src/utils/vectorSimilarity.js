export const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const key in vecA) {
    if (vecB[key]) {
      dot += vecA[key] * vecB[key];
    }
    normA += vecA[key] * vecA[key];
  }

  for (const key in vecB) {
    normB += vecB[key] * vecB[key];
  }

  if (normA === 0 || normB === 0) return 0;

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};
