const ConfidenceLegend = () => {
  return (
    <div className="flex gap-4 text-sm mb-6">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded bg-red-500" />
        <span>Low (&lt; 50%)</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded bg-yellow-400" />
        <span>Medium (50–74%)</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded bg-green-500" />
        <span>High (≥ 75%)</span>
      </div>
    </div>
  );
};

export default ConfidenceLegend;
