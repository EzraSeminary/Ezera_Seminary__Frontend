import { useState } from "react";
import DevotionDisplay from "@/features/devotions/DevotionDisplay";
import { useGetDevotionsQuery } from "@/redux/api-slices/apiSlice";
import { Devotion as DevotionType } from "@/redux/types"; // Import the Devotion type

const Devotion = () => {
  // Explicitly type the useState hook to use Devotion | null
  const [selectedDevotion, setSelectedDevotion] = useState<DevotionType | null>(
    null
  );

  // Use the useGetDevotionsQuery hook to fetch devotions
  // Assuming the hook does not require an argument, remove `undefined`
  const { data: devotions, error, isLoading } = useGetDevotionsQuery();

  if (isLoading) return "Loading...";
  if (error) return `Error: ${(error as Error).message}`;

  return (

    <div className=" flex h-full mt-12 pt-12 md:w-[95%] mx-auto">

      <DevotionDisplay
        devotions={devotions}
        selectedDevotion={selectedDevotion}
        setSelectedDevotion={setSelectedDevotion}
        showControls={false}
      />
    </div>
  );
};

export default Devotion;
