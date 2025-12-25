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
      console.log("Lost items (realtime):", lost.length);
      setLostItems(lost);
    });

    const unsubscribeFound = listenFoundItems((found) => {
      console.log("Found items (realtime):", found.length);
      setFoundItems(found);
    });

    // Cleanup listeners on unmount
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

    console.log("Matches generated:", result.length);
    console.log("Matches:", result);

    setMatches(result);
    setLoading(false);
  }, [lostItems, foundItems]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-500">Listening for matches...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">Possible Matches</h2>

      <ConfidenceLegend />

      {matches.length === 0 && (
        <p className="text-gray-500 mt-4">
          Waiting for matching lost & found items…
        </p>
      )}

      {matches.map((m, i) => (
        <div
          key={i}
          className="border p-4 rounded mb-4 bg-white shadow-sm"
        >
          <p className="font-semibold mb-2">
            {m.lostItem} ↔ {m.foundItem}
          </p>

          <ConfidenceBar score={m.score} />

          {m.breakdown && (
            <div className="text-sm text-gray-600 mt-2">
              <p>Text: {m.breakdown.text}%</p>
              <p>Location: {m.breakdown.location}%</p>
              <p>Time: {m.breakdown.time}%</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Matches;
