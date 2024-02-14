// Not fixed ❗❗❗❗❗❗
import { useState } from "react";
import DevotionDisplay from "@/features/devotions/DevotionDisplay";
import { useGetDevotionsQuery } from "@/redux/api-slices/apiSlice"; // import the hook from your apiSlice

const Devotion = () => {
  const [selectedDevotion, setSelectedDevotion] = useState(null);

  // Use the useGetDevotionsQuery hook to fetch devotions
  const { data: devotions, error, isLoading } = useGetDevotionsQuery({});

  if (isLoading) return "Loading...";
  if (error) return `Error: ${(error as Error).message}`;

  return (
    <div className=" flex h-auto mt-12 pt-12 w-[100%] mx-auto">
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
