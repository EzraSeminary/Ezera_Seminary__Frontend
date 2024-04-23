import Slider from "@mui/material/Slider";
import { sliderMarks } from "@/utils/SliderMarks";
import { useState } from "react";

function SliderDisplay() {
  // Slider state
  const [sliderValue, setSliderValue] = useState(2.5);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setSliderValue(newValue);
    }
  };

  return (
    <div className="w-[80%]">
      <Slider
        min={0}
        max={5}
        step={1}
        marks={sliderMarks}
        valueLabelDisplay="on"
        valueLabelFormat={(value) => (value === 2.5 ? "Touch to slide" : value)}
        value={sliderValue}
        onChange={handleSliderChange}
        sx={{
          color: "#424242",
          "& .MuiSlider-track": {
            backgroundColor: "#424242",
          },
          "& .MuiSlider-thumb": {
            backgroundColor: "white",
          },
          "& .MuiSlider-mark": {
            backgroundColor: "white",
          },
          "& .MuiSlider-markLabel": {
            color: "white",
          },
        }}
      />
      <div className="flex justify-between">
        <button className="text-white text-sm bg-secondary-7 bg-opacity-40 p-1 rounded-lg">
          ምንም አልተማርኩም
        </button>
        <button className="text-white text-sm bg-secondary-7 bg-opacity-40 p-1 rounded-lg">
          በጣም ተምሬያለሁ
        </button>
      </div>
    </div>
  );
}

export default SliderDisplay;
