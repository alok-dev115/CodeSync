import { useEffect, useState } from "react";
import { buildMatches } from "../utils/buildMatches";
import { listenLostItems, listenFoundItems } from "../firebase/realtimeItems";
import ConfidenceBar from "../components/ConfidenceBar";
import ConfidenceLegend from "../components/ConfidenceLegend";

const Matches = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔴 REALTIME LISTENERS
  useEffect(() => {
    const unsubscribeLost = listenLostItems(setLostItems);
    const unsubscribeFound = listenFoundItems(setFoundItems);

    return () => {
      unsubscribeLost();
      unsubscribeFound();
    };
  }, []);

  // 🔥 Recompute matches
  useEffect(() => {
    if (lostItems.length === 0 || foundItems.length === 0) {
      setMatches([]);
      setLoading(false);
      return;
    }

    const result = buildMatches(lostItems, foundItems);
    setMatches(result);
    setLoading(false);
  }, [lostItems, foundItems]);

  // ⏳ Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 animate-pulse">
          🔄 Listening for matches in real time…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-slate-800">
            AI-Detected Matches
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Automatically generated using text, location & time similarity
          </p>
        </div>

        {/* Legend */}
        <div className="flex justify-center mb-6">
          <ConfidenceLegend />
        </div>

        {/* Empty State */}
        {matches.length === 0 && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-slate-500">
            <p className="text-lg">No matches yet</p>
            <p className="text-sm mt-1">
              We’ll notify you as soon as a strong match appears.
            </p>
          </div>
        )}

        {/* Matches */}
        <div className="space-y-4">
          {matches.map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              {/* Match Header */}
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-slate-800">
                  {m.lostItem} <span className="text-slate-400">↔</span>{" "}
                  {m.foundItem}
                </p>

                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
                  Match #{i + 1}
                </span>
              </div>

              {/* Confidence Bar */}
              <ConfidenceBar score={m.score} />

              {/* Breakdown */}
              {m.breakdown && (
                <div className="grid grid-cols-3 gap-4 text-sm text-slate-600 mt-4">
                  <div>
                    <p className="font-medium text-slate-700">Text</p>
                    <p>{m.breakdown.text}%</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Location</p>
                    <p>{m.breakdown.location}%</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Time</p>
                    <p>{m.breakdown.time}%</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Matches;
