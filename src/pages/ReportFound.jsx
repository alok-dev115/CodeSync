import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { addFoundItem } from "../firebase/foundItems";
import { ngramEmbedding } from "../utils/ngramEmbedding";

const ReportFound = () => {
  const [form, setForm] = useState({
    itemName: "",
    location: "",
    date: "",
    time: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { itemName, location, date, time, description } = form;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // 🔒 Safe date construction
      const [year, month, day] = date.split("-").map(Number);
      const [hours, minutes] = time.split(":").map(Number);

      const jsDate = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes
      );

      if (isNaN(jsDate.getTime())) {
        throw new Error("Invalid date/time");
      }

      const foundAt = Timestamp.fromDate(jsDate);

      const textEmbedding = ngramEmbedding(
        itemName + " " + description
      );

      await addFoundItem({
        itemName,
        location,
        description,
        foundAt,
        textEmbedding,
      });

      setSuccess(true);
      setForm({
        itemName: "",
        location: "",
        date: "",
        time: "",
        description: "",
      });
    } catch (err) {
      console.error("Error adding found item:", err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <h2 className="text-3xl font-bold text-slate-800 text-center">
          Report Found Item
        </h2>
        <p className="text-sm text-slate-500 text-center mt-2">
          Help reunite a lost item with its owner
        </p>

        {/* Success Message */}
        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
            🎉 Found item reported successfully
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          {/* Item Name */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Item Name
            </label>
            <input
              name="itemName"
              value={itemName}
              onChange={handleChange}
              placeholder="e.g. Black Backpack"
              required
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Found Location
            </label>
            <input
              name="location"
              value={location}
              onChange={handleChange}
              placeholder="e.g. Near Canteen, Parking Area"
              required
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={date}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={time}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={handleChange}
              placeholder="Color, brand, stickers, any unique detail"
              required
              rows={3}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2.5 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Found Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportFound;
