import React from 'react'

const ItemCard = ({ title, location, date, description }) => {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600">{location} • {date}</p>
      <p className="mt-2 text-gray-700">{description}</p>
    </div>
  );
};

export default ItemCard;
