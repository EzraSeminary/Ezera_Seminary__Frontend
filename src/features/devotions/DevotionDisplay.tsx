import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import CurrentDevotional from "./CurrentDevotional";
import PreviousDevotionals from "./PreviousDevotionals";
// import Footer from "@/components/Footer";
import Categories from "../../features/courses/user/Categories";
import { useGetDevotionsQuery } from "../../redux/api-slices/apiSlice";
import { Devotion } from "@/redux/types";
import { toEthiopian } from "ethiopian-date";

// Define the type for a devotion object

export interface DevotionDisplayProps {
  showControls: boolean;
  devotions: Devotion[] | undefined; // Add this line
  toggleForm: () => void; // Add this line
}

const DevotionDisplay: React.FC<DevotionDisplayProps> = ({
  showControls,
  toggleForm,
}) => {
  const [selectedDevotion, setSelectedDevotion] = useState<Devotion | null>(
    null
  );
  const location = useLocation();
  const { selectedDevotion: selectedDevotionFromHome } = location.state || {};

  // Explicitly type the useState hook to use Devotion | null
  const { data: devotions, error, isLoading, refetch } = useGetDevotionsQuery(); // Fix the argument type

  const ethiopianMonths = useMemo(
    () => [
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
    ],
    []
  );

  useEffect(() => {
    if (selectedDevotionFromHome) {
      setSelectedDevotion(selectedDevotionFromHome);
    } else if (devotions && devotions.length > 0) {
      const today = new Date();
      const ethiopianDate = toEthiopian(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
      const [, month, day] = ethiopianDate;
      const ethiopianMonth = ethiopianMonths[month];

      // Find today's devotion
      const todaysDevotion = devotions.find(
        (devotion) =>
          devotion.month === ethiopianMonth && Number(devotion.day) === day
      );

      // If there's no devotion for today, use the most recent one
      setSelectedDevotion(todaysDevotion || devotions[0]);
    }
  }, [devotions, selectedDevotionFromHome, ethiopianMonths]);

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
    <div className="flex flex-col min-h-screen mx-auto">
      <div className="w-[100%] h-full font-nokia-bold  flex flex-col mx-auto container space-y-6 mb-12 flex-1">
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
      {/* <Footer /> */}
    </div>
  );
};

export default DevotionDisplay;
