// AudioPlayer.tsx
import React from 'react';

interface AudioPlayerProps {
  src: string;
  onPlay: () => void;
}

const AudioSection: React.FC<AudioPlayerProps> = ({ src, onPlay }) => {
  return (
    <div className="flex flex-col items-center justify-center w-[80%] rounded-3xl shadow-md">
      <audio controls className="w-full" onPlay={onPlay}>
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioSection;