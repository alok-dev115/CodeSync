import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

import { buildMatches } from "../utils/buildMatches";
import { compareImages } from "../utils/imageMatcher";
import { listenLostItems, listenFoundItems } from "../firebase/realtimeItems";
import { createClaim } from "../firebase/claims"; // ✅ FIX 1

import ConfidenceBar from "../components/ConfidenceBar";
import ConfidenceLegend from "../components/ConfidenceLegend";

/* ---------------------------- CONFIG ---------------------------- */

const IMAGE_WEIGHT = 0.3;
const BASE_WEIGHT = 0.7;

/* ---------------------------- COMPONENT ---------------------------- */

const Matches = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [matches, setMatches] = useState([]);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanningId, setScanningId] = useState(null);

  /* ----------------------- AUTH LISTENER ----------------------- */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

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
      if (!currentUserId) {
        setMatches([]);
        setLoading(false);
        return;
      }

      // 🔥 ONLY MY LOST ITEMS
      const myLostItems = lostItems.filter(
        (item) => item.userId === currentUserId && !item.claimed
      );

      if (!myLostItems.length || !foundItems.length) {
        setMatches([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const result = await buildMatches(myLostItems, foundItems);
        setMatches(result);
      } catch (err) {
        console.error("Match generation failed", err);
      } finally {
        setLoading(false);
      }
    };

    generateMatches();
  }, [lostItems, foundItems, currentUserId]);

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
            My Item Matches
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Matches for items you reported as lost
          </p>
        </header>

        <div className="flex justify-center mb-6">
          <ConfidenceLegend />
        </div>

        {matches.length === 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-md p-10 text-center text-slate-600">
            No matches found for your lost items yet.
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
    rawLostItem,
    rawFoundItem,
  } = match;

  const handleClaim = async () => {
    try {
      await createClaim({
        lostItemId: rawLostItem.id,
        foundItemId: rawFoundItem.id,
        lostUserId: auth.currentUser.uid,
        foundUserId: rawFoundItem.userId,
      });

      alert("✅ Claim request sent to finder");
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6">
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

      {/* ✅ CLAIM BUTTON */}
      <button
        onClick={handleClaim}
        className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-xl font-semibold hover:bg-emerald-700 transition"
      >
        Claim Item
      </button>

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
      alt={label}
      className={`w-24 h-24 object-cover rounded-lg border ${
        color === "red" ? "border-red-200" : "border-green-200"
      }`}
    />
    <span
      className={`text-xs font-bold block mt-1 ${
        color === "red" ? "text-red-500" : "text-green-500"
      }`}
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
