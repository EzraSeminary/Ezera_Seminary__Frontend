// components/EditSSLVideoLink.tsx
import { useState, MouseEventHandler } from "react";
import axios from "axios";

import { LinkType } from "@/redux/types"; // Assuming you have a type definition for 'LinkType'

interface EditSSLVideoLinkProps {
  link: {
    year: number;
    quarter: number;
    lesson: number;
    videoUrl: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EditSSLVideoLink: React.FC<EditSSLVideoLinkProps> = ({
  link,
  onSubmit,
  onCancel,
}) => {
  const [videoUrl, setVideoUrl] = useState(link.videoUrl);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/sslLinks/${link.year}/${link.quarter}/${link.lesson}`,
        { videoUrl }
      );
      onSubmit(response.data);
    } catch (error: any) {
      console.error(
        "Error updating video link:",
        error.response?.data || error
      );
      alert(
        "Error updating video link: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Edit YouTube Link
      </h2>

      <div>
        <label
          htmlFor="videoUrl"
          className="block text-sm font-medium text-gray-700"
        >
          YouTube URL
        </label>
        <input
          id="videoUrl"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Link
        </button>
      </div>
    </form>
  );
};

export default EditSSLVideoLink;
