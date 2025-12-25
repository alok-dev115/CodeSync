import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { addLostItem } from "../firebase/lostItems";
import { ngramEmbedding } from "../utils/ngramEmbedding";

const ReportLost = () => {
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
      const lostAt = Timestamp.fromDate(
        new Date(`${date}T${time}`)
      );

      const textEmbedding = ngramEmbedding(
        itemName + " " + description
      );

      await addLostItem({
        itemName,
        location,
        description,
        lostAt,
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
      console.error("Error adding lost item:", err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Report Lost Item</h2>

      {success && (
        <p className="mb-4 text-green-600">
          Lost item reported successfully
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
          placeholder="Lost Location"
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
          {loading ? "Submitting..." : "Submit Lost Item"}
        </button>
      </form>
    </div>
  );
};

export default ReportLost;
