import { useEffect, useState } from "react";
import CurrentDevotional from "./CurrentDevotional";
import PreviousDevotionals from "./PreviousDevotionals";
import Categories from "../../features/courses/user/Categories";
import { useGetDevotionsQuery } from "../../redux/api-slices/apiSlice";
import { Devotion } from "@/redux/types";
import { toEthiopian } from "ethiopian-date";

// Define the type for a devotion object

export interface DevotionDisplayProps {
  showControls: boolean;
  devotions: Devotion[] | undefined; // Add this line
  selectedDevotion: Devotion | null;
  toggleForm: () => void; // Add this line
  setSelectedDevotion: React.Dispatch<React.SetStateAction<Devotion | null>>;
}

const DevotionDisplay: React.FC<DevotionDisplayProps> = ({
  showControls,
  toggleForm,
}) => {
  const [selectedDevotion, setSelectedDevotion] = useState<Devotion | null>(
    null
  );
  const { data: devotions, error, isLoading, refetch } = useGetDevotionsQuery(); // Fix the argument type

  const ethiopianMonths = [
    "", // There is no month 0
    "መስከረም",
    "ጥቅምት",
    "ህዳር",
    "ታህሳስ",
    "ጥር",
    "የካቲት",
    "መጋቢት",
    "ሚያዝያ",
    "ግንቦት",
    "ሰኔ",
    "ሐምሌ",
    "ነሐሴ",
    "ጳጉሜ", // 13th month
  ];

  useEffect(() => {
    if (devotions && devotions.length > 0) {
      const today = new Date();
      // console.log("Today:", today); // Add this line

      const ethiopianDate = toEthiopian(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      ); // convert to Ethiopian date

      // console.log("Ethiopian date:", ethiopianDate); // Add this line

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [, month, day] = ethiopianDate;

      // Convert the month number to its Ethiopian name
      const ethiopianMonth = ethiopianMonths[month];

      // Find today's devotion
      const todaysDevotion = devotions.find(
        (devotion) =>
          devotion.month === ethiopianMonth && Number(devotion.day) === day
      );

      // If there's no devotion for today, use the most recent one
      setSelectedDevotion(todaysDevotion || devotions[0]);
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
    <div className="w-[100%] h-full font-nokia-bold  flex flex-col mx-auto container space-y-6 mb-12 flex-1 flex-grow">
      <CurrentDevotional
        devotionToDisplay={devotionToDisplay}
        showControls={showControls}
        toogleForm={toggleForm} // Add this line
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
