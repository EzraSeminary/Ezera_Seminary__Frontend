// components/AddSSLVideoLinks.jsx
import { useState } from "react";
import axios from "axios";

const AddSSLVideoLinks = () => {
  const [formData, setFormData] = useState({
    year: "",
    quarter: "",
    lesson: "",
    videoUrl: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await axios.post("/api/videoLinks", formData);
      alert("Video link added successfully");
      setFormData({ year: "", quarter: "", lesson: "", videoUrl: "" });
    } catch (error) {
      alert("Error adding video link");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="year"
        value={formData.year}
        onChange={handleChange}
        placeholder="Year"
        required
      />
      <input
        name="quarter"
        value={formData.quarter}
        onChange={handleChange}
        placeholder="Quarter"
        required
      />
      <input
        name="lesson"
        value={formData.lesson}
        onChange={handleChange}
        placeholder="Lesson"
        required
      />
      <input
        name="videoUrl"
        value={formData.videoUrl}
        onChange={handleChange}
        placeholder="YouTube URL"
        required
      />
      <button type="submit">Add Video Link</button>
    </form>
  );
};

export default AddSSLVideoLinks;
