import React from 'react';
import { ArrowLeft, CornersOut } from '@phosphor-icons/react';

interface ImageSectionProps {
  imageUrl: string;
  isFullScreen: boolean;
  handleOpenFullScreen: () => void;
  handleCloseFullScreen: () => void;
}

const ImageSection: React.FC<ImageSectionProps> = ({
  imageUrl,
  isFullScreen,
  handleOpenFullScreen,
  handleCloseFullScreen,
}) => {
  return (
    <div className="w-full h-auto">
      {isFullScreen ? (
        <div className="absolute top-0 right-0 w-full h-full z-50 p-4">
          <div className="relative w-full h-full bg-secondary-7 bg-opacity-50 p-4 rounded-xl">
            <ArrowLeft
              size={40}
              className="absolute top-4 left-4 text-primary-5 bg-secondary-7 border p-1 rounded-full z-50 cursor-pointer hover:bg-secondary-5 transition-all"
              weight="bold"
              onClick={handleCloseFullScreen}
            />
            <img
              src={imageUrl}
              alt="fullscreen content"
              className="w-full h-full object-contain rounded-3xl"
            />
          </div>
        </div>
      ) : (
        <div
          className="relative w-[30vh] h-[30vh] mx-auto my-2 shadow-xl bg-secondary-7 bg-opacity-50 rounded-xl"
          onClick={handleOpenFullScreen}
        >
          <img
            src={imageUrl}
            alt="no image"
            className="w-full h-full object-contain shadow-xl rounded-xl text-primary-5 text-center"
          />
          <CornersOut
            size={28}
            className="absolute bottom-1 right-1 text-primary-5 bg-secondary-7 border p-1 rounded-lg z-50 cursor-pointer hover:bg-secondary-5 transition-all"
            weight="bold"
          />
        </div>
      )}
    </div>
  );
};

export default ImageSection;