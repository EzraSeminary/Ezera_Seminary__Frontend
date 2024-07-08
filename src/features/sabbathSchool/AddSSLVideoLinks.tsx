// components/AddSSLVideoLinks.jsx
import { useState } from "react";
import axios from "axios";

const AddSSLVideoLinks = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    quarter: "1",
    lesson: "1",
    videoUrl: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/sslLinks", formData);
      onSubmit(response.data.videoUrl);
    } catch (error) {
      alert("Error adding video link: " + error.message);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label
          htmlFor="year"
          className="block text-sm font-medium text-gray-700"
        >
          Year
        </label>
        <select
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="quarter"
          className="block text-sm font-medium text-gray-700"
        >
          Quarter
        </label>
        <select
          id="quarter"
          name="quarter"
          value={formData.quarter}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {[1, 2, 3, 4].map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="lesson"
          className="block text-sm font-medium text-gray-700"
        >
          Lesson
        </label>
        <select
          id="lesson"
          name="lesson"
          value={formData.lesson}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {Array.from({ length: 14 }, (_, i) => i + 1).map((lesson) => (
            <option key={lesson} value={lesson}>
              {lesson}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="videoUrl"
          className="block text-sm font-medium text-gray-700"
        >
          YouTube URL
        </label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          value={formData.videoUrl}
          onChange={handleChange}
          placeholder="https://www.youtube.com/watch?v=..."
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Link
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddSSLVideoLinks;
