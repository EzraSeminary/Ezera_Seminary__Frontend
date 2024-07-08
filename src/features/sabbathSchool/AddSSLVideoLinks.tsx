// components/AddSSLVideoLinks.jsx
import { useState } from "react";
import axios from "axios";

const AddSSLVideoLinks = ({ onSubmit, onCancel, year, quarter, lesson }) => {
  const [videoUrl, setVideoUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/sslLinks", {
        year,
        quarter,
        lesson,
        videoUrl,
      });
      onSubmit(response.data.videoUrl);
    } catch (error) {
      alert("Error adding video link");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="YouTube URL"
        required
        className="px-2 py-1 border rounded mr-2"
      />
      <button
        type="submit"
        className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
      >
        Add Link
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-2 py-1 bg-gray-300 rounded"
      >
        Cancel
      </button>
    </form>
  );
};

export default AddSSLVideoLinks;
