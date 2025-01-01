import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import CurrentDevotional from "./CurrentDevotional";
import Categories from "../../features/courses/user/Categories";
import { useGetDevotionsQuery } from "../../redux/api-slices/apiSlice";
import { Devotion } from "@/redux/types";
import LoadingPage from "@/pages/user/LoadingPage";
import MonthFolder from "./MonthFolder";
import {
  convertToEthiopianDate,
  findDevotion,
  sortMonthsChronologically,
  ethiopianMonths,
  sortDevotionsByDayDescending,
} from "./devotionUtils";
import { RootState } from "@/redux/store";

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
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const location = useLocation();
  const { selectedDevotion: selectedDevotionFromHome } = location.state || {};
  const { data: devotions, error, isLoading, refetch } = useGetDevotionsQuery();
  const user = useSelector((state: RootState) => state.auth.user);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDevotionFromHome) {
      setSelectedDevotion(selectedDevotionFromHome);
    } else if (devotions && devotions.length > 0) {
      const today = new Date();
      const [, month] = convertToEthiopianDate(today);
      const ethiopianMonth = ethiopianMonths[month];

      const todaysDevotion =
        findDevotion(devotions, 0, today) ||
        findDevotion(devotions, 1, today) ||
        findDevotion(devotions, 2, today) ||
        devotions.find((devotion) => devotion.month === ethiopianMonth);

      setSelectedDevotion(todaysDevotion || devotions[0]);
    }
  }, [devotions, selectedDevotionFromHome]);

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
  const previousDevotions = devotions.filter(
    (devotion: Devotion) => devotion._id !== devotionToDisplay._id
  );
  const devotionsByMonth = devotions.reduce((acc, devotion) => {
    const key = devotion.month;
    if (!acc[key]) acc[key] = [];
    acc[key].push(devotion);
    return acc;
  }, {} as Record<string, Devotion[]>);

  // Get today's Ethiopian date [year, month, day]
  const [currentYear, currentMonthIndex, currentDay] = convertToEthiopianDate(
    new Date()
  );

  // Filter out future days for non-Admin/Instructor users
  if (user && user.role !== "Admin" && user.role !== "Instructor") {
    for (const month in devotionsByMonth) {
      const monthIndex = ethiopianMonths.indexOf(month);
      // If it's the current Ethiopian month, filter devotions beyond today's day
      if (monthIndex === currentMonthIndex) {
        devotionsByMonth[month] = devotionsByMonth[month].filter(
          (devotion) => Number(devotion.day) <= currentDay
        );
      }
    }
  }

  // Sort devotions within each month by descending day
  for (const month in devotionsByMonth) {
    devotionsByMonth[month] = sortDevotionsByDayDescending(
      devotionsByMonth[month]
    );
  }

  // Sort months (Meskerem -> Pagume)
  const sortedMonths = sortMonthsChronologically(devotionsByMonth);

  // For non-admin/instructor, only show months from Meskerem (index 1) up to currentMonthIndex
  const filteredMonths =
    user && (user.role === "Admin" || user.role === "Instructor")
      ? sortedMonths
      : sortedMonths.filter((month) => {
          const monthIndex = ethiopianMonths.indexOf(month);
          // Skip the empty "" month (index 0) and show up to current month
          return monthIndex >= 1 && monthIndex <= currentMonthIndex;
        });

  return (
    <div className="flex flex-col min-h-screen mx-auto" ref={topRef}>
      <div className="w-[100%] h-full font-nokia-bold flex flex-col mx-auto container space-y-6 mb-12 flex-1">
        <CurrentDevotional
          devotionToDisplay={devotionToDisplay}
          showControls={showControls}
          toogleForm={toggleForm}
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
