// utils/ngramEmbedding.js
export const ngramEmbedding = (text) => {
  const vec = new Array(10).fill(0);
  for (let i = 0; i < text.length; i++) {
    vec[i % 10] += text.charCodeAt(i);
  }
  return vec;
};