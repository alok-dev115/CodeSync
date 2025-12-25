import MatchCard from "../components/MatchCard";
import React from 'react'

const Matches = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Possible Matches</h2>

      <MatchCard item="Black Wallet" confidence={92} />
      <MatchCard item="Student ID Card" confidence={85} />
      <MatchCard item="Wireless Earbuds" confidence={78} />
    </div>
  );
};

export default Matches;
