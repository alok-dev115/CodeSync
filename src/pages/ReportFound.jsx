import { useState, useRef } from "react";
import axios from "axios";
import { Timestamp } from "firebase/firestore";
import { addFoundItem } from "../firebase/addItem";
import { ngramEmbedding } from "../utils/ngramEmbedding";

const ReportFound = () => {
  const [form, setForm] = useState({
    itemName: "",
    location: "",
    date: "",
    time: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const [y, m, d] = form.date.split("-");
      const [h, min] = form.time.split(":");
      const foundAt = Timestamp.fromDate(
        new Date(y, m - 1, d, h, min)
      );

      const textEmbedding = ngramEmbedding(
        form.itemName + " " + form.description
      );

      let imageUrl = "";

      if (image) {
        const fd = new FormData();
        fd.append("image", image);

        const res = await axios.post(
          "http://localhost:5000/upload",
          fd
        );

        imageUrl = res.data.imageUrl;
      }

      await addFoundItem({
        itemName: form.itemName,
        location: form.location,
        description: form.description,
        foundAt,
        textEmbedding,
        imageUrl,
      });

      setSuccess(true);
      setForm({
        itemName: "",
        location: "",
        date: "",
        time: "",
        description: "",
      });
      removeImage();
    } catch (err) {
      console.error("Error adding found item:", err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Report Found Item
      </h2>

      {success && (
        <p className="text-green-600 mb-4">
          Found item reported successfully
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="itemName"
          placeholder="Item Name"
          value={form.itemName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="location"
          placeholder="Found Location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* 📷 IMAGE UPLOAD ICON */}
        {!preview && (
          <label className="cursor-pointer inline-flex items-center gap-2 text-blue-600 font-medium">
            📷 Upload Image
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={handleImageChange}
            />
          </label>
        )}

        {preview && (
          <div className="space-y-2">
            <img
              src={preview}
              alt="preview"
              className="w-40 h-40 object-cover border rounded"
            />
            <button
              type="button"
              onClick={removeImage}
              className="text-red-600 text-sm"
            >
              Remove Image
            </button>
          </div>
        )}

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
