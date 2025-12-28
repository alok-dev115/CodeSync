import { useState, useRef } from "react";
import axios from "axios";
import { Timestamp } from "firebase/firestore";
import { addLostItem } from "../firebase/addItem";
import { ngramEmbedding } from "../utils/ngramEmbedding";

const ReportLost = () => {
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

  const { itemName, location, date, time, description } = form;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // IMAGE SELECT (camera or browse)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // REMOVE IMAGE
  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // SAFE date creation
      const lostAt = Timestamp.fromDate(
        new Date(`${date}T${time}`)
      );

      const textEmbedding = ngramEmbedding(
        itemName + " " + description
      );

      let imageUrl = "";

      // UPLOAD IMAGE
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const res = await axios.post(
          "http://localhost:5000/upload",
          formData
        );

        imageUrl = res.data.imageUrl;
      }

      // SAVE TO FIRESTORE
      await addLostItem({
        itemName,
        location,
        description,
        lostAt,
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
      console.error("Error adding lost item:", err);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Report Lost Item</h2>

      {success && (
        <p className="text-green-600 mb-4">
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
          placeholder="Last Seen Location"
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

        {/* IMAGE UPLOAD */}
        <div className="space-y-2">
          {!preview && (
            <label className="cursor-pointer text-blue-600">
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
            <div className="relative w-40">
              <img
                src={preview}
                alt="preview"
                className="w-40 h-40 object-cover rounded border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6"
              >
                ✕
              </button>
            </div>
          )}
        </div>

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
