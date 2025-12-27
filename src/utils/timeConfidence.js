export const timeConfidence = (lostAt, foundAt) => {
  const diffMs = Math.abs(foundAt - lostAt);
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours <= 6) return 100;
  if (diffHours <= 24) return 85;
  if (diffHours <= 72) return 65;
  if (diffHours <= 168) return 40;
  return 10;
};