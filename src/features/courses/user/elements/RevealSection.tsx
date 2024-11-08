import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';

interface RevealSectionItem {
  title: string;
  content: string;
}

interface RevealSectionProps {
  revealItems: RevealSectionItem[];
  setIsRevealFlipped?: (isFlipped: boolean) => void;
}


const RevealSection: React.FC<RevealSectionProps> = ({ revealItems, setIsRevealFlipped }) => {
    const [flip, setFlip] = useState<boolean[]>(revealItems.map(() => false));
  
    const handleFlip = (index: number) => {
      setFlip((prevState) => {
        const newState = [...prevState];
        newState[index] = !prevState[index]; // Toggle the state at the specified index
  
        // Check if all items have been flipped at least once
        const isAllItemsFlipped = newState.every((isFlipped) => isFlipped);
        if (isAllItemsFlipped) {
          if (setIsRevealFlipped)
            setIsRevealFlipped(true);
        }
  
        return newState;
      });
    };
  
    const handleClick = (index: number) => {
      handleFlip(index);
    };

  return (
    <>
      {revealItems.map((revealItem, index) => (
        <ReactCardFlip
          isFlipped={flip[index]}
          flipDirection="vertical"
          key={index}
          containerClassName="w-full h-auto flex flex-col justify-center items-center font-nokia-bold"
        >
          <div
            onClick={() => handleClick(index)}
            className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto h-[100px] flex items-center justify-center text-center bg-secondary-4 bg-opacity-20 shadow-2xl px-2 text-accent-5 text-lg hover:bg-secondary-2 hover:bg-opacity-20 cursor-pointer transition-all rounded-lg my-1 border border-accent-6"
          >
            {revealItem.title}
          </div>
          <div
            onClick={() => handleClick(index)}
            className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto h-[100px] py-4 overflow-y-auto scrollbar-thin flex items-center justify-center text-center bg-accent-9 border-2 border-accent-6 shadow-2xl px-2 text-primary-2 text-lg hover:bg-accent-10 cursor-pointer transition-all rounded-lg my-1"
          >
            {revealItem.content}
          </div>
        </ReactCardFlip>
      ))}
    </>
  );
};

export default RevealSection;