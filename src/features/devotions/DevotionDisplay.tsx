/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import CurrentDevotional from "./CurrentDevotional";
import Categories from "../../features/courses/user/Categories";
import { useGetDevotionsQuery } from "../../redux/api-slices/apiSlice";
import { Devotion } from "@/redux/types";
import { EthDateTime } from "ethiopian-calendar-date-converter";
import LoadingPage from "@/pages/user/LoadingPage";
import MonthFolder from "./MonthFolder";

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
  const ethiopianMonths = useMemo(
    () => [
      "",
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
      "ጳጉሜ",
    ],
    []
  );

  const topRef = useRef<HTMLDivElement>(null);

  const convertToEthiopianDate = (date: Date) => {
    const ethDateTime = EthDateTime.fromEuropeanDate(date);
    return [ethDateTime.year, ethDateTime.month, ethDateTime.date];
  };

  useEffect(() => {
    if (selectedDevotionFromHome) {
      setSelectedDevotion(selectedDevotionFromHome);
    } else if (devotions && devotions.length > 0) {
      const today = new Date();
      const [year, month, day] = convertToEthiopianDate(today);
      const ethiopianMonth = ethiopianMonths[month];

      console.log("Ethiopian Date:", [year, month, day]);
      console.log("Ethiopian Month:", ethiopianMonth);

      const findDevotion = (offset: number) => {
        const date = new Date(today);
        date.setDate(today.getDate() - offset);
        const [y, m, d] = convertToEthiopianDate(date);
        const monthName = ethiopianMonths[m];
        console.log(`Checking for devotion on: ${monthName} ${d}`);
        return devotions.find(
          (devotion) =>
            devotion.month === monthName && Number(devotion.day) === d
        );
      };

      const todaysDevotion =
        findDevotion(0) ||
        findDevotion(1) ||
        findDevotion(2) ||
        devotions.find((devotion) => devotion.month === ethiopianMonth);

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

  const previousDevotions = devotions.filter(
    (devotion: Devotion) => devotion._id !== devotionToDisplay._id
  );

  const devotionsByMonthYear = previousDevotions.reduce((acc, devotion) => {
    const key = `${devotion.month}-${devotion.year}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(devotion);
    return acc;
  }, {} as Record<string, Devotion[]>);

  const sortedMonthYears = Object.keys(devotionsByMonthYear).sort((a, b) => {
    const today = new Date();
    const [currentYear, currentMonth] = convertToEthiopianDate(today);
    const [monthA, yearA] = a.split("-");
    const [monthB, yearB] = b.split("-");
    const monthIndexA = ethiopianMonths.indexOf(monthA);
    const monthIndexB = ethiopianMonths.indexOf(monthB);
    const adjustedIndexA = (monthIndexA - currentMonth + 13) % 13;
    const adjustedIndexB = (monthIndexB - currentMonth + 13) % 13;
    if (yearA !== yearB) {
      return Number(yearB) - Number(yearA);
    }
    return adjustedIndexB - adjustedIndexA;
  });

  const today = new Date();
  const [currentYear, currentMonth] = convertToEthiopianDate(today);
  const currentMonthYear = `${ethiopianMonths[currentMonth]}-${currentYear}`;
  const sortedMonthsWithCurrentFirst = [
    currentMonthYear,
    ...sortedMonthYears.filter((key) => key !== currentMonthYear),
  ];

  return (
    <div className="flex flex-col min-h-screen mx-auto" ref={topRef}>
      <div className="w-[100%] h-full font-nokia-bold flex flex-col mx-auto container space-y-6 mb-12 flex-1">
        <CurrentDevotional
          devotionToDisplay={devotionToDisplay}
          showControls={showControls}
          toogleForm={toggleForm}
        />
        <div className="flex flex-col space-y-4">
          {sortedMonthsWithCurrentFirst.map((monthYear) => {
            const [month] = monthYear.split("-");
            return (
              <MonthFolder
                key={monthYear}
                month={month}
                devotions={devotionsByMonthYear[monthYear]}
                setSelectedDevotion={setSelectedDevotion}
                isSelected={selectedMonth === monthYear}
                onSelect={() =>
                  setSelectedMonth(
                    selectedMonth === monthYear ? null : monthYear
                  )
                }
              />
            );
          })}
        </div>
        <Categories title="Lessons Available" />
      </div>
    </div>
  );
};

export default DevotionDisplay;
