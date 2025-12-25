const normalize = (text) =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ");

export const textSimilarity = (a, b) => {
  if (!a || !b) return 0;

  const wordsA = new Set(normalize(a));
  const wordsB = new Set(normalize(b));

  let common = 0;
  wordsA.forEach(word => {
    if (wordsB.has(word)) common++;
  });

  return (common / Math.max(wordsA.size, wordsB.size)) * 100;
};
