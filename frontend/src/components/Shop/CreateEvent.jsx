import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createEvent } from "../../redux/actions/event";

const CreateEvent = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
    start_Date: "",
    Finish_Date: "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    Array.from(images).forEach((image) => {
      data.append("images", image);
    });

    await dispatch(createEvent(data));
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-6">
      <h2 className="mb-6 text-2xl font-semibold">Create Event</h2>

      <div className="grid gap-5 md:grid-cols-2">
        {[
          ["name", "Event Name"],
          ["category", "Category"],
          ["originalPrice", "Original Price"],
          ["discountPrice", "Discount Price"],
          ["stock", "Stock"],
          ["start_Date", "Start Date"],
          ["Finish_Date", "Finish Date"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="mb-2 block text-sm font-medium">{label}</label>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              type={name.includes("Date") || name.includes("_Date") ? "date" : "text"}
              className="w-full rounded-md border px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>
        ))}
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="5"
          className="w-full rounded-md border px-4 py-3 outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          className="w-full rounded-md border p-3"
        />
      </div>

      <button
        type="submit"
        className="mt-6 rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
      >
        Create Event
      </button>
    </form>
  );
};

export default CreateEvent;