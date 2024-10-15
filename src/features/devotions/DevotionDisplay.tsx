import { useEffect, useState, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import CurrentDevotional from "./CurrentDevotional";
import Categories from "../../features/courses/user/Categories";
import { useGetDevotionsQuery } from "../../redux/api-slices/apiSlice";
import { Devotion } from "@/redux/types";
import { toEthiopian } from "ethiopian-date";
import LoadingPage from "@/pages/user/LoadingPage";
import MonthFolder from "./MonthFolder"; // Import the new component

export interface DevotionDisplayProps {
  showControls: boolean;
  devotions: Devotion[] | undefined;
  toggleForm: () => void;
}

const DevotionDisplay: React.FC<DevotionDisplayProps> = ({
  showControls,
  toggleForm,
}) => {
  const [selectedDevotion, setSelectedDevotion] = useState<Devotion | null>(
    null
  );
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null); // State to track selected month
  const location = useLocation();
  const { selectedDevotion: selectedDevotionFromHome } = location.state || {};
  const { data: devotions, error, isLoading, refetch } = useGetDevotionsQuery();
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

  const topRef = useRef<HTMLDivElement>(null);

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

      const todaysDevotion = devotions.find(
        (devotion) =>
          devotion.month === ethiopianMonth && Number(devotion.day) === day
      );

      setSelectedDevotion(todaysDevotion || devotions[0]);
    }
  }, [devotions, selectedDevotionFromHome, ethiopianMonths]);

  useEffect(() => {
    refetch();
  }, [devotions, refetch]);

  useEffect(() => {
    if (selectedDevotion) {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedDevotion]);

  if (isLoading) return <LoadingPage />;
  if (error) return `Error: ${(error as Error).message}`;

  if (!devotions || devotions.length === 0) {
    return <div>No devotions available</div>;
  }

  const devotionToDisplay = selectedDevotion || devotions[0];

  // Filter out the current devotion from the list of previous devotions
  const previousDevotions = devotions.filter(
    (devotion: Devotion) => devotion._id !== devotionToDisplay._id
  );

  // Group previous devotions by month
  const devotionsByMonth = previousDevotions.reduce((acc, devotion) => {
    if (!acc[devotion.month]) {
      acc[devotion.month] = [];
    }
    acc[devotion.month].push(devotion);
    return acc;
  }, {} as Record<string, Devotion[]>);

  // Sort months based on their order from today's current devotion date in descending Ethiopian month order
  const sortedMonths = Object.keys(devotionsByMonth).sort((a, b) => {
    const today = new Date();
    const ethiopianDate = toEthiopian(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    const [, currentMonth] = ethiopianDate;
    const monthIndexA = ethiopianMonths.indexOf(a);
    const monthIndexB = ethiopianMonths.indexOf(b);
    const adjustedIndexA = (monthIndexA - currentMonth + 13) % 13;
    const adjustedIndexB = (monthIndexB - currentMonth + 13) % 13;
    return adjustedIndexA - adjustedIndexB;
  });

  return (
    <div className="flex flex-col min-h-screen mx-auto" ref={topRef}>
      <div className="w-[100%] h-full font-nokia-bold  flex flex-col mx-auto container space-y-6 mb-12 flex-1">
        <CurrentDevotional
          devotionToDisplay={devotionToDisplay}
          showControls={showControls}
          toogleForm={toggleForm}
        />
        <div className="flex flex-col space-y-4">
          {sortedMonths.map((month) => (
            <MonthFolder
              key={month}
              month={month}
              devotions={devotionsByMonth[month]}
              setSelectedDevotion={setSelectedDevotion}
              isSelected={selectedMonth === month}
              onSelect={() => setSelectedMonth(month)}
            />
          ))}
        </div>
        <Categories title="Lessons Available" />
      </div>
    </div>
  );
};

export default DevotionDisplay;
