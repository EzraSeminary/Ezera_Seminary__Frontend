import { useEffect, useState } from "react";
import CurrentDevotional from "./CurrentDevotional";
import PreviousDevotionals from "./PreviousDevotionals";
import Categories from "../../features/courses/user/Categories";
import { useGetDevotionsQuery } from "../../redux/api-slices/apiSlice";
import { Devotion } from "@/redux/types";

// Define the type for a devotion object

interface DevotionDisplayProps {
  showControls: boolean;
  devotions: Devotion[] | undefined; // Add this line
  selectedDevotion: Devotion | null;
  setSelectedDevotion: React.Dispatch<React.SetStateAction<Devotion | null>>;
}

const DevotionDisplay: React.FC<DevotionDisplayProps> = ({ showControls }) => {
  const [selectedDevotion, setSelectedDevotion] = useState<Devotion | null>(
    null
  );
  const { data: devotions, error, isLoading, refetch } = useGetDevotionsQuery(); // Fix the argument type

  useEffect(() => {
    if (devotions && devotions.length > 0) {
      setSelectedDevotion(devotions[0]);
    }
  }, [devotions]);

  useEffect(() => {
    refetch();
  }, [devotions, refetch]);

  if (isLoading) return "Loading...";
  if (error) return `Error: ${(error as Error).message}`;

  if (!devotions || devotions.length === 0) {
    return <div>No devotions available</div>;
  }

  const devotionToDisplay = selectedDevotion || devotions[0];

  const previousDevotions = devotions.filter(
    (devotion: Devotion) => devotion._id !== devotionToDisplay._id
  );

  return (
    <div className="w-[100%] h-auto font-nokia-bold  flex flex-col mx-auto container space-y-6 mb-12">
      <CurrentDevotional
        devotionToDisplay={devotionToDisplay}
        showControls={showControls}
      />
      <PreviousDevotionals
        previousDevotions={previousDevotions}
        setSelectedDevotion={(devotion: Devotion) =>
          setSelectedDevotion(devotion)
        }
      />
      <Categories title="Lessons Available" />
    </div>
  );
};

export default DevotionDisplay;
