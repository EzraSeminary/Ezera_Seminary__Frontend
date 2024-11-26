// DevotionDisplay.tsx
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import CurrentDevotional from "./CurrentDevotional";
import Categories from "../../features/courses/user/Categories";
import { Devotion } from "@/types/devotionTypes";
import LoadingPage from "@/pages/user/LoadingPage";
import MonthFolder from "./MonthFolder";
import {
  convertToEthiopianDate,
  sortMonthsChronologically,
  ethiopianMonths,
  sortDevotionsByDayDescending,
} from "./devotionUtils";
import { RootState } from "@/redux/store";

export interface DevotionDisplayProps {
  todayDevotion: Devotion | undefined;
  currentMonthDevotions: Devotion[] | undefined;
  showControls: boolean;
  toggleForm: () => void;
}

const DevotionDisplay: React.FC<DevotionDisplayProps> = ({
  todayDevotion,
  currentMonthDevotions,
  showControls,
  toggleForm,
}) => {
  const [selectedDevotion, setSelectedDevotion] = useState<Devotion | null>(
    todayDevotion || null
  );
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const location = useLocation();
  const { selectedDevotion: selectedDevotionFromHome } = location.state || {};
  const user = useSelector((state: RootState) => state.auth.user);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDevotionFromHome) {
      setSelectedDevotion(selectedDevotionFromHome);
    } else if (todayDevotion) {
      setSelectedDevotion(todayDevotion);
    }
  }, [todayDevotion, selectedDevotionFromHome]);

  useEffect(() => {
    if (selectedDevotion) {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedDevotion]);

  if (!todayDevotion || !currentMonthDevotions) {
    return <LoadingPage />;
  }

  const devotionToDisplay = selectedDevotion || currentMonthDevotions[0];

  const previousDevotions = currentMonthDevotions.filter(
    (devotion: Devotion) => devotion._id !== devotionToDisplay._id
  );

  const devotionsByMonth = previousDevotions.reduce((acc, devotion) => {
    const key = devotion.month;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(devotion);
    return acc;
  }, {} as Record<string, Devotion[]>);

  // Sort devotions within each month by day descending
  Object.keys(devotionsByMonth).forEach((month) => {
    if (Array.isArray(devotionsByMonth[month])) {
      devotionsByMonth[month] = sortDevotionsByDayDescending(
        devotionsByMonth[month]
      );
    }
  });

  // Get months sorted chronologically
  const sortedMonths = sortMonthsChronologically(devotionsByMonth);

  // Get current Ethiopian month index
  const today = new Date();
  const [, currentMonthIndex] = convertToEthiopianDate(today);

  // Determine which months to display based on user role
  const filteredMonths =
    user && (user.role === "Admin" || user.role === "Instructor")
      ? sortedMonths
      : sortedMonths.filter((month) => {
          const monthIndex = ethiopianMonths.indexOf(month) + 1;
          return monthIndex > 0 && monthIndex <= currentMonthIndex;
        });

  return (
    <div className="flex flex-col min-h-screen mx-auto" ref={topRef}>
      <div className="w-full h-full font-nokia-bold flex flex-col mx-auto container space-y-6 mb-12 flex-1">
        <CurrentDevotional
          devotionToDisplay={devotionToDisplay}
          showControls={showControls}
          toggleForm={toggleForm} // Corrected typo
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredMonths.map((month) => (
            <MonthFolder
              key={month}
              month={month}
              devotions={devotionsByMonth[month]}
              setSelectedDevotion={setSelectedDevotion}
              isSelected={selectedMonth === month}
              onSelect={() =>
                setSelectedMonth(selectedMonth === month ? null : month)
              }
              isExpanded={selectedMonth === month}
            />
          ))}
        </div>
        <Categories title="Lessons Available" />
      </div>
    </div>
  );
};

export default DevotionDisplay;
