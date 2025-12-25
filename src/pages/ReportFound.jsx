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

      const jsDate = new Date(
        year,
        month - 1, // JS months are 0-based
        day,
        hours,
        minutes
      );

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
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Report Found Item</h2>

      {success && (
        <p className="mb-4 text-green-600">
          Found item reported successfully
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="itemName"
          value={itemName}
          onChange={handleChange}
          placeholder="Item Name"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="location"
          value={location}
          onChange={handleChange}
          placeholder="Found Location"
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="date"
          value={date}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="time"
          name="time"
          value={time}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full border p-2 rounded"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Found Item"}
        </button>
      </form>
    </div>
  );
};

export default ReportFound;
