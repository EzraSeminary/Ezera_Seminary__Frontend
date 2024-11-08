import { useState } from 'react';

interface FlipState {
  [index: number]: boolean;
}

const useCardFlip = () => {
  const [flip, setFlip] = useState<FlipState>({});

  const handleFlip = (index: number) => {
    setFlip((prevState) => {
      const isFlipped = !prevState[index]; // Toggle the state
      const newState = { ...prevState, [index]: isFlipped };
      return newState;
    });
  };

  return [flip, handleFlip] as const;
};

export default useCardFlip;