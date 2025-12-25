const ConfidenceBar = ({ score }) => {
  // Clamp score between 0–100
  const safeScore = Math.max(0, Math.min(100, score));

  let color = "bg-red-500";
  if (safeScore >= 75) color = "bg-green-500";
  else if (safeScore >= 50) color = "bg-yellow-400";

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span>Confidence</span>
        <span>{Math.round(safeScore)}%</span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
