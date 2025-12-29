import { useEffect, useState } from "react";
import { buildMatches } from "../utils/buildMatches";
import { compareImages } from "../utils/imageMatcher";
import { listenLostItems, listenFoundItems } from "../firebase/realtimeItems";
import ConfidenceBar from "../components/ConfidenceBar";
import ConfidenceLegend from "../components/ConfidenceLegend";

const Matches = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanningId, setScanningId] = useState(null);

  // 🔴 Realtime listeners
  useEffect(() => {
    const unsubLost = listenLostItems(setLostItems);
    const unsubFound = listenFoundItems(setFoundItems);

    return () => {
      unsubLost();
      unsubFound();
    };
  }, []);

  // 🔥 Async match generation (auto image scan included)
  useEffect(() => {
    const generateMatches = async () => {
      if (lostItems.length === 0 || foundItems.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await buildMatches(lostItems, foundItems);
      setMatches(result);
      setLoading(false);
    };

    generateMatches();
  }, [lostItems, foundItems]);

  // 👆 Manual image scan
  const handleManualScan = async (index, match) => {
    setScanningId(index);

    try {
      const result = await compareImages(
        match.lostItemImage,
        match.foundItemImage
      );

      const imgScore = result.similarityScore;

      const updated = [...matches];
      updated[index] = {
        ...updated[index],
        isScanned: true,
        breakdown: {
          ...updated[index].breakdown,
          image: imgScore,
        },
        score: updated[index].score * 0.7 + imgScore * 0.3,
      };

      updated.sort((a, b) => b.score - a.score);
      setMatches(updated);
    } catch (err) {
      console.error("Manual scan failed", err);
    }

    setScanningId(null);
  };

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <p className="text-slate-500 text-lg animate-pulse">
          🤖 AI is analyzing matches...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
          Possible Matches
        </h2>
        <p className="text-slate-600 text-center mb-8 text-sm">
          Matches based on text, location, time & image similarity
        </p>

        <div className="flex justify-center mb-6">
          <ConfidenceLegend />
        </div>

        {matches.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-md p-10 text-center text-slate-600">
            No strong matches yet.
          </div>
        )}

        <div className="space-y-6">
          {matches.map((m, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6"
            >
              {/* Images */}
              <div className="flex justify-center gap-8 mb-4">
                {m.lostItemImage && (
                  <div className="text-center">
                    <img
                      src={m.lostItemImage}
                      className="w-24 h-24 object-cover rounded-lg border border-red-200"
                    />
                    <span className="text-xs text-red-500 font-bold block mt-1">
                      LOST
                    </span>
                  </div>
                )}
                {m.foundItemImage && (
                  <div className="text-center">
                    <img
                      src={m.foundItemImage}
                      className="w-24 h-24 object-cover rounded-lg border border-green-200"
                    />
                    <span className="text-xs text-green-500 font-bold block mt-1">
                      FOUND
                    </span>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-center text-slate-800 mb-3">
                {m.lostItem} <span className="mx-2">↔</span> {m.foundItem}
              </h3>

              <ConfidenceBar score={m.score} />

              <div className="grid grid-cols-4 gap-4 text-sm mt-4">
                <Breakdown label="Text" value={m.breakdown.text + "%"} />

                {m.breakdown.image !== null ? (
                  <Breakdown label="Image" value={m.breakdown.image + "%"} />
                ) : (
                  <button
                    onClick={() => handleManualScan(i, m)}
                    disabled={
                      scanningId === i ||
                      !m.lostItemImage ||
                      !m.foundItemImage
                    }
                    className="bg-gray-100 rounded-xl p-3 hover:bg-indigo-600 hover:text-white transition disabled:opacity-50"
                  >
                    {scanningId === i ? "Scanning…" : "Analyze 🖼️"}
                  </button>
                )}

                <Breakdown label="Loc" value={m.breakdown.location + "%"} />
                <Breakdown label="Time" value={m.breakdown.time + "%"} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Breakdown = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl p-3 text-center">
    <p className="font-medium text-slate-700">{label}</p>
    <p className="text-blue-600 font-bold">{value}</p>
  </div>
);

export default Matches;
