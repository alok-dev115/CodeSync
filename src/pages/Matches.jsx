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
    const unsubscribeLost = listenLostItems((lost) => {
      setLostItems(lost);
    });

    const unsubscribeFound = listenFoundItems((found) => {
      setFoundItems(found);
    });

    return () => {
      unsubscribeLost();
      unsubscribeFound();
    };
  }, []);

  // 🔥 Recompute matches whenever lost/found updates
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

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <p className="text-slate-500 text-sm animate-pulse">
          Listening for matches…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">
          Possible Matches
        </h2>
        <p className="text-slate-600 text-center mb-8 text-sm">
          AI-generated matches based on text, location, and time similarity
        </p>

        <div className="flex justify-center mb-6">
          <ConfidenceLegend />
        </div>

        {/* Empty State */}
        {matches.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-md p-10 text-center text-slate-600">
            No strong matches yet. <br />
            New reports will appear here automatically.
          </div>
        )}

        {/* Matches */}
        <div className="space-y-6">
          {matches.map((m, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 transition hover:shadow-xl"
            >
              {/* Title */}
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                {m.lostItem} <span className="text-slate-400">↔</span>{" "}
                {m.foundItem}
              </h3>

              {/* Confidence */}
              <ConfidenceBar score={m.score} />

              {/* Breakdown */}
              {m.breakdown && (
                <div className="grid grid-cols-3 gap-4 text-sm text-slate-600 mt-4">
                  <Breakdown label="Text Match" value={m.breakdown.text} />
                  <Breakdown label="Location Match" value={m.breakdown.location} />
                  <Breakdown label="Time Match" value={m.breakdown.time} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 🔹 Small reusable breakdown block
const Breakdown = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl p-3 text-center">
    <p className="font-medium text-slate-700">{label}</p>
    <p className="text-blue-600 font-bold">{value}%</p>
  </div>
);

export default Matches;
