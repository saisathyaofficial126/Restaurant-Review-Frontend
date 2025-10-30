import { useState } from "react";
import axios from "axios";

const initialState = {
  name: "",
  rating: "",
  ratingCount: "",
  cuisines: "",
  priceForTwo: "",
  address: "",
  location: "",
  openingTime: "",
  closingTime: "",
  phone: "",
  timeSlots: "",
  direction: "",
  info: "",
  totalSeats: "",
};

export default function AddRestaurantForm({ onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mainImageFile, setMainImageFile] = useState(null);
  const [otherImageFiles, setOtherImageFiles] = useState([]);
  const [menuImageFiles, setMenuImageFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMainImageChange = (e) => {
    setMainImageFile(e.target.files[0]);
  };

  const handleOtherImagesChange = (e) => {
    setOtherImageFiles(Array.from(e.target.files));
  };

  const handleMenuImagesChange = (e) => {
    setMenuImageFiles(Array.from(e.target.files));
  };

  // Prepare all data and images in a single FormData object
  const prepareData = async () => {
    const data = new FormData();

    // Append form fields
    data.append("name", form.name);
    data.append("rating", form.rating);
    data.append("ratingCount", form.ratingCount);
    data.append("cuisines", form.cuisines);
    data.append("priceForTwo", form.priceForTwo);
    data.append("address", form.address);
    data.append("location", form.location);
    data.append("openingTime", form.openingTime);
    data.append("closingTime", form.closingTime);
    data.append("phone", form.phone);
    data.append("timeSlots", form.timeSlots);
    data.append("direction", form.direction);
    data.append("info", form.info);
    data.append("totalSeats", form.totalSeats);

    // Append main image
    if (mainImageFile) {
      data.append("mainImage", mainImageFile);
    }

    // Append other images
    otherImageFiles.forEach((file) => {
      data.append("otherImages", file);
    });

    // Append menu images
    menuImageFiles.forEach((file) => {
      data.append("menuImages", file);
    });

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await prepareData();
      // Send the form data to the backend
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/add-restaurants`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Restaurant added successfully!");
      setForm(initialState);
      setMainImageFile(null);
      setOtherImageFiles([]);
      setMenuImageFiles([]);
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error adding restaurant.");
    }
    setLoading(false);
  };

  return (
    <form
      className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto space-y-4"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold mb-4">Add Restaurant</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Restaurant Name (e.g., The Gourmet Spot)"
          required
          className="border p-2 rounded"
        />
        <input
          name="cuisines"
          value={form.cuisines}
          onChange={handleChange}
          placeholder="Cuisines (comma separated)"
          required
          className="border p-2 rounded"
        />
        <input
          name="priceForTwo"
          value={form.priceForTwo}
          onChange={handleChange}
          placeholder="Price for Two"
          type="number"
          min="0"
          required
          className="border p-2 rounded"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          required
          className="border p-2 rounded"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location (e.g., Chennai)"
          required
          className="border p-2 rounded"
        />
        <input
          name="openingTime"
          value={form.openingTime}
          onChange={handleChange}
          placeholder="Opening Time (e.g. 10:00)"
          required
          className="border p-2 rounded"
        />
        <input
          name="closingTime"
          value={form.closingTime}
          onChange={handleChange}
          placeholder="Closing Time (e.g., 22:00)"
          required
          className="border p-2 rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
          className="border p-2 rounded"
        />
        {/* Main Image Upload */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="border p-2 rounded"
          />
        </div>
        {/* Other Images Upload */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Other Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleOtherImagesChange}
            className="border p-2 rounded"
          />
        </div>
        {/* Menu Images Upload */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Menu Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMenuImagesChange}
            className="border p-2 rounded"
          />
        </div>
        <input
          name="timeSlots"
          value={form.timeSlots}
          onChange={handleChange}
          placeholder="Time Slots: 9,11,12,13,18,19"
          className="border p-2 rounded"
        />
        <input
          name="direction"
          value={form.direction}
          onChange={handleChange}
          placeholder="Google Map Direction Link"
          required
          className="border p-2 rounded"
        />
        <input
          name="info"
          value={form.info}
          onChange={handleChange}
          placeholder="More Info (comma separated, e.g. Live Music, Valet Parking, Outdoor Seating)"
          className="border p-2 rounded"
        />
        <input
          name="totalSeats"
          value={form.totalSeats}
          onChange={handleChange}
          placeholder="Total Number of Seats"
          type="number"
          min="0"
          className="border p-2 rounded"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
      >
        {loading ? "Adding..." : "Add Restaurant"}
      </button>
      {message && <div className="mt-2 text-center text-sm">{message}</div>}
    </form>
  );
}