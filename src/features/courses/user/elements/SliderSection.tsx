import React from 'react';
import Slider from "@mui/material/Slider";

interface SliderSectionProps {
  sliderMarks: { value: number; label: string }[];
  sliderValue: number;
  setSliderValue: (value: number) => void;
  setIsRangeChanged: (isChanged: boolean) => void;
}

const SliderSection: React.FC<SliderSectionProps> = ({
  sliderMarks,
  sliderValue,
  setSliderValue,
  setIsRangeChanged,
}) => {
    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        if (typeof newValue === "number") {
        setSliderValue(newValue);
        setIsRangeChanged(true); // Next button available when slider value is changed
        }
        };

  return (
    <>
      <div className="w-[80%] pt-8 mx-auto">
        <Slider
          min={0}
          max={5}
          step={1}
          marks={sliderMarks}
          onChange={handleSliderChange}
          value={sliderValue}
          sx={{
            color: "#EA9215",
            "& .MuiSlider-track": {
              backgroundColor: "",
            },
            "& .MuiSlider-thumb": {
              backgroundColor: "#AAB0B4",
            },
            "& .MuiSlider-mark": {
              backgroundColor: "#EEEEEE",
            },
            "& .MuiSlider-markLabel": {
              color: "#EEEEEE",
            },
            "& .MuiSlider-valueLabel": {
              color: "#EEEEEE",
            },
          }}
        />
      </div>
      <div className="flex justify-between w-full md:px-14">
        <button className="text-primary-6 text-sm font-nokia-bold lg:text-lg xl:text-xl bg-accent-6 hover:bg-accent-7 transition-all w-max py-1 px-4 rounded-full">
          ዝቅተኛ
        </button>
        <button className="text-primary-6 text-sm font-nokia-bold lg:text-lg xl:text-xl bg-accent-6 hover:bg-accent-7 transition-all w-max py-1 px-4 rounded-full">
          ከፍተኛ
        </button>
      </div>
    </>
  );
};

export default SliderSection;