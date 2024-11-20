import React from 'react';

interface VerseSectionProps {
  verses: [string, string][]; // Each verse is a tuple [reference, text]
}

const VerseSection: React.FC<VerseSectionProps> = ({ verses }) => {
  return (
    <div className="w-full flex flex-col items-center mt-4">
      {verses.map(([reference, text], index) => (
        <div
          key={index}
          className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto flex items-start justify-center text-center bg-secondary-4 bg-opacity-20 shadow-2xl px-4 py-6 text-accent-5 text-lg hover:bg-secondary-2 hover:bg-opacity-20 transition-all rounded-lg my-2 border border-accent-6 relative"
        >
          <span className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 text-lg text-primary-2 bg-accent-9 bg-opacity-80 px-2 py-1 rounded-md shadow-md">
            {reference}
          </span>
          <p className="w-full text-primary-2 text-lg leading-relaxed">
            {text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default VerseSection;
