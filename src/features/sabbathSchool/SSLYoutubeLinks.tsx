// SSLYoutubeLinks.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { YoutubeLogo } from "@phosphor-icons/react";
import AddSSLVideoLinks from "./AddSSLVideoLinks";
import EditSSLVideoLink from "./EditSSLVideoLink";

interface YoutubeLink: number;
  quarter: number;
  lesson: number;
  videoUrl: string;
}

interface SSLYoutubeLinksProps {
  year: number;
  quarter: string;
  lesson: string;
}

const SSLYoutubeLinks: React.FC<SSLYoutubeLinksProps> = ({ year, quarter, lesson }) => {
  const [youtubeLink, setYoutubeLink] = useState<YoutubeLink | null>(null);
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [editingLink, setEditingLink] = useState<YoutubeLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getQuarterNumber = useCallback((quarter: string) => {
    const = quarter.split("-");
    return parts.length > 1 ? parseInt(parts[1]) : parseInt(quarter);
  }, []);

  const fetchYoutubeLink = useCallback(async () => {
    try {
      const quarterNumber = getQuarterNumber(quarter);
      const response = await axios.get(`/sslLinks/${year}/${quarterNumber}/${lesson}`);
      if (response.data && response.data.videoUrl) {
        setYoutubeLink(response.data);
      } else {
        setYoutubeLink(null);
      }
    } catch (error) {
      console.error("Failed to fetch YouTube link:", error);
      setYoutubeLink(null
  }, [year, quarter, lesson, getQuarterNumber]);

  useEffect(() => {
    fetchYoutubeLink();
  }, [fetchYoutubeLink]);

  const handleAddYoutubeLink = async (newLink: string, year: number, quarter: number, lesson: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/sslLinks`, {
        videoUrl: newLink,
        year,
        quarter,
        lesson,
      });
      setYoutubeLink(response.data);
      setShowAddLinkForm(false);
    } catch (error: any) {
      console.error("Error adding YouTube link:", error.response?.data || error);
      alert("Failed to add YouTube link. Please try again. " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditYoutubeLink = async (updatedLink: string, year: number, quarter: number, lesson: number) => {
    try {
      const response = await axios.put(`/sslLinks/${year}/${quarter}/${lesson}`, {
        videoUrl: updatedLink,
      });
      setYoutubeLink(response.data);
      setEditingLink(null);
    } catch (error: any) {
      console.error("Error updating YouTube link:", error.response?.data
      alert("Failed to update YouTube link. Please try again. " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteYoutubeLink = async () => {
    if (!youtubeLink) return;

    if (window.confirm("Are you sure you want to delete this YouTube link?")) {
      try {
        await axios.delete(`/sslLinks/${youtubeLink.year}/${youtubeLink.quarter}/${youtubeLink.lesson}`);
        setYoutubeLink(null);
        alert("YouTube link successfully deleted.");
      } catch (error: any) {
        console.error("Error deleting.response?.data || error);
        alert(`Failed to delete YouTube link. Please try again. ${error.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    <div className="flex justify-end mt-2 md:mt-4 space-x-2">
      {youtubeLink ? (
        <>
          <youtubeLink.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all"
          >
            Watch on YouTube <YoutubeLogo size={24} weight="fill" />
          </a>
          <button
            onClick={() => setEditingLink(youtubeLink)}
            className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all"
          >
            Edit Link
          </button>
          <button
            onClick={handleDeleteYoutubeLink}
            className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all"
          >
            Delete Link
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowAddLinkForm(true)}
          className="px-2 border border-primary-1 text-primary-1 text-xs flex rounded-full items-center gap-2 hover:border-accent-6 hover:text-accent-6 transition-all"
        >
          Add YouTube Link
        </button>
      )}

      {showAddLinkForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p- rounded-lg shadow-xl max-w-md w-full">
            <AddSSLVideoLinks
              onSubmit={handleAddYoutubeLink}
              onCancel={() => setShowAddLinkForm(false)}
              year={year}
              quarter={getQuarterNumber(quarter)}
              lesson={parseInt(lesson)}
            />
          </div>
        </div>
      )}

      {editingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <EditSSLVideoLink
              link={editingLink}
              onSubmit={handleEditYoutubeLink}
              onCancel={() => setEditingLink(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SSLYoutubeLinks;
