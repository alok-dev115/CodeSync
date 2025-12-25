import React from 'react'

const ReportFound = () => {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Report Found Item</h2>

      <form className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Item Name" />
        <input className="w-full border p-2 rounded" placeholder="Found Location" />
        <input type="date" className="w-full border p-2 rounded" />
        <textarea className="w-full border p-2 rounded" placeholder="Description"></textarea>

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Submit Found Item
        </button>
      </form>
    </div>
  );
};

export default ReportFound;
