import { useState, useRef } from "react";
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

  const { itemName, location, date, time, description } = form;

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* -------------------- HANDLERS -------------------- */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // ✅ Date & time handling
      const [year, month, day] = date.split("-").map(Number);
      const [hours, minutes] = time.split(":").map(Number);

      const jsDate = new Date(year, month - 1, day, hours, minutes);
      if (isNaN(jsDate.getTime())) {
        throw new Error("Invalid date/time");
      }

      const lostAt = Timestamp.fromDate(jsDate);

      const textEmbedding = ngramEmbedding(itemName + " " + description);

      let imageUrl = "";

      // 📷 Upload image via Netlify Function
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        // const res = await fetch("/.netlify/functions/upload", {
        //   method: "POST",
        //   body: formData,
        // });
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Image upload failed");
        }

        const data = await res.json();
        imageUrl = data.imageUrl;
      }

      // 🔥 Save to Firestore
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
      console.error("Error reporting lost item:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6">
      <div className="bg-white/80 backdrop-blur-xl w-full max-w-xl rounded-3xl shadow-2xl p-10">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
          Report Lost Item
        </h2>
        <p className="text-slate-600 text-center mb-8 text-sm">
          Let us help you recover your lost belongings
        </p>

        {success && (
          <div className="mb-6 text-green-700 bg-green-50 px-4 py-3 rounded-lg text-sm text-center">
            ✅ Lost item reported successfully
          </div>
        )}

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
            placeholder="Lost Location"
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
            placeholder="Describe the item (color, brand, last seen details, etc.)"
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />

          {/* IMAGE UPLOAD */}
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />

            {!preview ? (
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/40 transition"
              >
                <div className="text-3xl mb-1">📷</div>
                <p className="font-medium text-slate-700">
                  Upload an image of the item
                </p>
                <p className="text-xs text-slate-500">
                  Improves matching accuracy
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Lost Item"}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-500 text-center">
          We’ll notify you when a potential match is found
        </p>
      </div>
    </div>
  );
};

export default ReportLost;
