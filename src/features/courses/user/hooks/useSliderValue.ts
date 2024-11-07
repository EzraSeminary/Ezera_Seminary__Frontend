import { useState } from 'react';
import { Event } from '@mui/material/Slider';

const useSliderValue = () => {
  const [sliderValue, setSliderValue] = useState(2.5);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setSliderValue(newValue);
    }
  };

  return [sliderValue, handleSliderChange] as const;
};

export default useSliderValue;