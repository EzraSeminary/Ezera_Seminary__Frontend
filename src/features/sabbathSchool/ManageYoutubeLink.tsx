import { useState, useEffect } from "react";
import {
  useAddVideoLinkMutation,
  useUpdateVideoLinkMutation,
  useDeleteVideoLinkMutation,
  useGetVideoLinkQuery,
} from "../../services/videoLinksApi";

type ManageYouTubeLinkProps = {
  year: number;
  quarter: number;
  lesson: number;
};

const ManageYouTubeLink = ({
  year,
  quarter,
  lesson,
}: ManageYouTubeLinkProps) => {
  const {
    data: videoLink,
    error,
    isLoading,
  } = useGetVideoLinkQuery({ year, quarter, lesson });
  const [videoUrl, setVideoUrl] = useState("");
  const [addVideoLink] = useAddVideoLinkMutation();
  const [updateVideoLink] = useUpdateVideoLinkMutation();
  const [deleteVideoLink] = useDeleteVideoLinkMutation();

  useEffect(() => {
    if (videoLink) {
      setVideoUrl(videoLink.videoUrl);
    }
  }, [videoLink]);

  const handleAddOrUpdate = async () => {
    try {
      if (videoLink) {
        await updateVideoLink({ year, quarter, lesson, videoUrl });
      } else {
        await addVideoLink({ year, quarter, lesson, videoUrl });
      }
    } catch (error) {
      console.error("Failed to add or update video link:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVideoLink({ year, quarter, lesson });
      setVideoUrl("");
    } catch (error) {
      console.error("Failed to delete video link:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    if (error.status === 404) {
      console.warn(
        "Video link not found for the specified year, quarter, and lesson."
      );
    } else {
      console.error("Error fetching video link:", error);
      return <div>Error: {error.message}</div>;
    }
  }

  return (
    <div>
      <h3>YouTube Link Management</h3>
      <div>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube Link"
        />
        <button onClick={handleAddOrUpdate}>
          {videoLink ? "Update" : "Add"} Link
        </button>
        {videoLink && (
          <>
            <button onClick={handleDelete}>Delete Link</button>
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
              <button>Watch on YouTube</button>
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageYouTubeLink;
