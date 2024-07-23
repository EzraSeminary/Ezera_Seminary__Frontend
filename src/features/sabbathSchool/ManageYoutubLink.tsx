// ManageYouTubeLink.js
import React, { useState, useEffect } from "react";
import {
  useAddVideoLinkMutation,
  useUpdateVideoLinkMutation,
  useDeleteVideoLinkMutation,
  useGetVideoLinkQuery,
} from "../../services/videoLinksApi";

const ManageYouTubeLink = ({ year, quarter, lesson }) => {
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
    if (videoLink) {
      await updateVideoLink({ year, quarter, lesson, videoUrl });
    } else {
      await addVideoLink({ year, quarter, lesson, videoUrl });
    }
  };

  const handleDelete = async () => {
    await deleteVideoLink({ year, quarter, lesson });
    setVideoUrl("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
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
        {videoLink && <button onClick={handleDelete}>Delete Link</button>}
      </div>
    </div>
  );
};

export default ManageYouTubeLink;
