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
      // 🔒 SAFEST POSSIBLE DATE CREATION (NO PARSING)
      const [year, month, day] = date.split("-").map(Number);
      const [hours, minutes] = time.split(":").map(Number);

      const jsDate = new Date(year, month - 1, day, hours, minutes);

      if (isNaN(jsDate.getTime())) {
        throw new Error("Invalid date/time input");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6">
      <div className="bg-white/80 backdrop-blur-xl w-full max-w-xl rounded-3xl shadow-2xl p-10">

        {/* Header */}
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
          Report Found Item
        </h2>
        <p className="text-slate-600 text-center mb-8 text-sm">
          Help return a lost item to its owner
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-6 text-green-700 bg-green-50 px-4 py-3 rounded-lg text-sm text-center">
            ✅ Found item reported successfully
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="itemName"
            value={itemName}
            onChange={handleChange}
            placeholder="Item Name"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="location"
            value={location}
            onChange={handleChange}
            placeholder="Found Location"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="time"
              name="time"
              value={time}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <textarea
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Describe the item (color, brand, condition, etc.)"
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />

          <button
            disabled={loading}
            className="
              w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
              hover:bg-blue-700 hover:-translate-y-0.5
              transition-all duration-200 shadow-md
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Submitting..." : "Submit Found Item"}
          </button>
        </form>

        {/* Footer hint */}
        <p className="mt-6 text-xs text-slate-500 text-center">
          Your report helps reunite lost items with their owners
        </p>
      </div>
    </div>
  );
};

export default ReportFound;
