// components/AddSSLVideoLinks.jsx
import React, { useState, useEffect, useCallback } from "react";

type AddSSLVideoLinksProps = {
  onSubmit: (
    videoUrl: string,
    year: number,
    quarter: number,
    lesson: number
  ) => void;
  onCancel: () => void;
  year: number;
  quarter: string;
  lesson: string;
};

const AddSSLVideoLinks = ({
  onSubmit,
  onCancel,
  year,
  quarter,
  lesson,
}: AddSSLVideoLinksProps) => {
  const [formData, setFormData] = useState({
    year: year || new Date().getFullYear(),
    quarter: parseInt(quarter) || 1,
    lesson: parseInt(lesson) || 1,
    videoUrl: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      year: year || new Date().getFullYear(),
      quarter: parseInt(quarter) || 1,
      lesson: parseInt(lesson) || 1,
    }));
  }, [year, quarter, lesson]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "videoUrl" ? value : parseInt(value),
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit(
        formData.videoUrl,
        formData.year,
        formData.quarter,
        formData.lesson
      );
    },
    [formData, onSubmit]
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Add YouTube Link
      </h2>

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

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-accent-6 text-white rounded hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Link
        </button>
      </div>
    </form>
  );
};

export default React.memo(AddSSLVideoLinks);
