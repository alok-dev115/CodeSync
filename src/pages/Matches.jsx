import { useEffect, useState } from "react";

import { buildMatches } from "../utils/buildMatches";
import { compareImages } from "../utils/imageMatcher";
import {
  listenLostItems,
  listenFoundItems,
} from "../firebase/realtimeItems";

import ConfidenceBar from "../components/ConfidenceBar";
import ConfidenceLegend from "../components/ConfidenceLegend";

/* ---------------------------- CONFIG ---------------------------- */

const IMAGE_WEIGHT = 0.3;
const BASE_WEIGHT = 0.7;

/* ---------------------------- COMPONENT ---------------------------- */

const Matches = () => {
  /* ---------------------------- STATE ---------------------------- */

  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [matches, setMatches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [scanningId, setScanningId] = useState(null);

  /* ----------------------- REALTIME LISTENERS ---------------------- */

  useEffect(() => {
    const unsubscribeLost = listenLostItems(setLostItems);
    const unsubscribeFound = listenFoundItems(setFoundItems);

    return () => {
      unsubscribeLost();
      unsubscribeFound();
    };
  }, []);

  /* ---------------------- AUTO MATCH GENERATION --------------------- */

  useEffect(() => {
    const generateMatches = async () => {
      if (!lostItems.length || !foundItems.length) {
        setMatches([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const result = await buildMatches(lostItems, foundItems);
        setMatches(result);
      } catch (err) {
        console.error("Match generation failed", err);
      } finally {
        setLoading(false);
      }
    };

    generateMatches();
  }, [lostItems, foundItems]);

  /* ----------------------- MANUAL IMAGE SCAN ----------------------- */

  const handleManualScan = async (index, match) => {
    setScanningId(index);

    try {
      const { similarityScore } = await compareImages(
        match.lostItemImage,
        match.foundItemImage
      );

      const updatedMatches = [...matches];

      updatedMatches[index] = {
        ...updatedMatches[index],
        isScanned: true,
        breakdown: {
          ...updatedMatches[index].breakdown,
          image: similarityScore,
        },
        score:
          updatedMatches[index].score * BASE_WEIGHT +
          similarityScore * IMAGE_WEIGHT,
      };

      updatedMatches.sort((a, b) => b.score - a.score);
      setMatches(updatedMatches);
    } catch (err) {
      console.error("Manual image scan failed", err);
    } finally {
      setScanningId(null);
    }
  };

  /* -------------------------- LOADING UI --------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <p className="text-slate-500 text-lg animate-pulse">
          🤖 AI is analyzing matches...
        </p>
      </div>
    );
  }

  /* ---------------------------- RENDER ----------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Possible Matches
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Based on text, location, time & image similarity
          </p>
        </header>

        <div className="flex justify-center mb-6">
          <ConfidenceLegend />
        </div>

        {matches.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-md p-10 text-center text-slate-600">
            No strong matches yet.
          </div>
        )}

        <div className="space-y-6">
          {matches.map((match, index) => (
            <MatchCard
              key={index}
              match={match}
              index={index}
              scanningId={scanningId}
              onScan={handleManualScan}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* -------------------------- SUBCOMPONENTS -------------------------- */

const MatchCard = ({ match, index, scanningId, onScan }) => {
  const {
    lostItem,
    foundItem,
    lostItemImage,
    foundItemImage,
    score,
    breakdown,
  } = match;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6">
      {/* Images */}
      <div className="flex justify-center gap-8 mb-4">
        {lostItemImage && (
          <ImageBlock src={lostItemImage} label="LOST" color="red" />
        )}
        {foundItemImage && (
          <ImageBlock src={foundItemImage} label="FOUND" color="green" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-center text-slate-800 mb-3">
        {lostItem} <span className="mx-2">↔</span> {foundItem}
      </h3>

      <ConfidenceBar score={score} />

      <div className="grid grid-cols-4 gap-4 text-sm mt-4">
        <Breakdown label="Text" value={`${breakdown.text}%`} />

        {breakdown.image !== null ? (
          <Breakdown label="Image" value={`${breakdown.image}%`} />
        ) : (
          <button
            onClick={() => onScan(index, match)}
            disabled={
              scanningId === index ||
              !lostItemImage ||
              !foundItemImage
            }
            className="bg-gray-100 rounded-xl p-3 hover:bg-indigo-600 hover:text-white transition disabled:opacity-50"
          >
            {scanningId === index ? "Scanning…" : "Analyze 🖼️"}
          </button>
        )}

        <Breakdown label="Loc" value={`${breakdown.location}%`} />
        <Breakdown label="Time" value={`${breakdown.time}%`} />
      </div>
    </div>
  );
};

const ImageBlock = ({ src, label, color }) => (
  <div className="text-center">
    <img
      src={src}
      className={`w-24 h-24 object-cover rounded-lg border border-${color}-200`}
      alt={label}
    />
    <span
      className={`text-xs text-${color}-500 font-bold block mt-1`}
    >
      {label}
    </span>
  </div>
);

const Breakdown = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl p-3 text-center">
    <p className="font-medium text-slate-700">{label}</p>
    <p className="text-blue-600 font-bold">{value}</p>
  </div>
);

export default Matches;
