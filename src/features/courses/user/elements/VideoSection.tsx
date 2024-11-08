import React from 'react';
import YouTube from 'react-youtube';
import { YoutubeLogo } from '@phosphor-icons/react';
import { getYoutubeThumbnailUrl, getYoutubeVideoId } from '../utils/youtubeUtils';

interface VideoSectionProps {
  videoUrl: string;
  isVideoVisible: boolean;
  handleImageClick: () => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  videoUrl,
  isVideoVisible,
  handleImageClick,
}) => {

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const videoId = getYoutubeVideoId(videoUrl);
  const thumbnailUrl = videoId ? getYoutubeThumbnailUrl(videoId) : undefined;

  return videoId ? (
    isVideoVisible ? (
      <div className="w-full md:w-3/4 lg:w-1/2 aspect-video">
        <YouTube
          videoId={videoId}
          opts={opts}
          className="w-full h-full"
        />
      </div>
    ) : (
      <div
        className="relative w-full md:w-3/4 lg:w-1/2 aspect-video mx-auto hover:opacity-80 hover:cursor-pointer transition-all border border-accent-6 border-opacity-50 p-2 rounded-lg"
        onClick={handleImageClick}
      >
        <img
          src={thumbnailUrl}
          alt="YouTube Thumbnail"
          className="w-full h-full object-cover shadow-lg"
        />
        <YoutubeLogo
          size={48}
          weight="fill"
          className="absolute inset-0 m-auto text-[#FF0000] drop-shadow-lg"
        />
      </div>
    )
  ) : (
    <p className="text-white">Invalid YouTube URL</p>
  );
};

export default VideoSection;