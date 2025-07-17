import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddItem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "book",
    ageRange: "0-2",
    mode: "donation",
    condition: "used",
    photoUrl: "",
    price: ""
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, photoUrl: reader.result }));
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      // Keep the mode as "sale" - don't convert to "buy"
      const priceValue =
        form.mode === "sale" && form.price && parseFloat(form.price) > 0
          ? parseFloat(form.price)
          : null;

      const payload = {
        ownerId: userId,
        title: form.title,
        description: form.description,
        type: form.type,
        mode: form.mode, // Keep original mode (sale/donation/trade)
        ageRange: form.ageRange,
        condition: form.condition,
        photoUrl: form.photoUrl,
        price: priceValue,
        available: true,
        createdAt: new Date()
      };

      const res = await fetch("http://localhost:3032/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add item");

      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f4] font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full bg-white pt-6 pb-5 shadow-sm border-b">
        <div className="flex items-center justify-center">
          <img src="/toytalelogo.png" alt="Toytale Logo" className="h-16 object-contain" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">➕ Add New Item</h2>

          <div className="space-y-6 text-sm text-gray-700">
            <input
              name="title"
              placeholder="Item Title"
              value={form.title}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278d80] bg-gray-50"
            />

            <textarea
              name="description"
              placeholder="Item Description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full border px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#278d80] bg-gray-50"
            />

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#278d80]"
            >
              <option value="book">Book</option>
              <option value="toy">Toy</option>
            </select>

            <select
              name="ageRange"
              value={form.ageRange}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#278d80]"
            >
              <option value="0-2">0–2 years</option>
              <option value="3-5">3–5 years</option>
              <option value="6-8">6–8 years</option>
              <option value="9-12">9–12 years</option>
              <option value="13-18">13–18 years</option>
            </select>

            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#278d80]"
            >
              <option value="donation">Donation</option>
              <option value="trade">Trade</option>
              <option value="sale">Sale</option>
            </select>

            {form.mode === "sale" && (
              <div>
                <label className="block text-sm font-medium mb-1">Price (€)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
            )}

            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#278d80]"
            >
              <option value="like new">Like New</option>
              <option value="used">Used</option>
              <option value="worn">Worn</option>
            </select>

            <div>
              <label className="block text-sm font-medium mb-2">Item Photo</label>
              <input type="file" accept="image/*" onChange={handleImage} className="w-full text-sm" />
              {form.photoUrl && (
                <img
                  src={form.photoUrl}
                  alt="Preview"
                  className="mt-4 w-full h-48 object-cover rounded-lg shadow-sm"
                />
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => navigate("/home")}
                className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#278d80] text-white py-3 px-6 rounded-lg hover:bg-[#226f6a] transition"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
