import React from 'react'

const MatchCard = ({ item, confidence }) => {
  return (
    <div className="border rounded p-4 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{item}</h3>
        <p className="text-sm text-gray-600">Confidence: {confidence}%</p>
      </div>
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Claim
      </button>
    </div>
  );
};

export default MatchCard;
