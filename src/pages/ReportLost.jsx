import React from 'react'

const ReportLost = () => {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Report Lost Item</h2>

      <form className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Item Name" />
        <input className="w-full border p-2 rounded" placeholder="Lost Location" />
        <input type="date" className="w-full border p-2 rounded" />
        <textarea className="w-full border p-2 rounded" placeholder="Description"></textarea>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Find Matches
        </button>
      </form>
    </div>
  );
};

export default ReportLost;
