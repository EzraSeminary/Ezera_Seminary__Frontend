import React, { useState } from 'react';
import { X } from '@phosphor-icons/react';

interface VerseSectionProps {
  verses: [string, string][]; // Each verse is a tuple [reference, text]
}

const VerseSection: React.FC<VerseSectionProps> = ({ verses }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClose = () => {
    setActiveIndex(null);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-4">
      {verses.map(([reference, ], index) => (
        <div key={index} className="w-full flex flex-col items-center mt-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveIndex(index);
            }}
            className="text-primary-2 underline"
          >
            {reference}
          </a>
        </div>
      ))}

      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOutsideClick}
        >
          <div
          className="w-auto max-w-[70%] sm:mx-auto md:max-w-[65%] md:ml-[20%] lg:max-w-[50%] lg:ml-[40%] flex items-start justify-center text-center bg-secondary-6 bg-opacity-85 shadow-2xl px-4 py-6 text-accent-5 text-lg hover:bg-secondary-5 hover:bg-opacity-40 transition-all rounded-lg my-2 border border-accent-6 relative"
        >
          <span className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 text-lg text-primary-2 bg-accent-8  px-4 py-1 rounded-md shadow-md">
            {verses[activeIndex][0]}
          </span>
          <X
              onClick={handleClose}
              className="text-primary-5 z-50 text-2xl bg-accent-6 border p-1 rounded-full absolute right-1 top-1 cursor-pointer"
            />
          <p className="w-full text-primary-2 text-lg leading-relaxed py-1">
            {verses[activeIndex][1]}
          </p>
        </div>
        </div>
      )}
    </div>
  );
};

export default VerseSection;
