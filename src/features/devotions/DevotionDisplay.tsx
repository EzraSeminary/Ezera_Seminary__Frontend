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
      "ሚያዚያ",
      "ግንቦት",
      "ሰኔ",
      "ሐምሌ",
      "ነሐሴ",
      "ጳጉሜ",
    ],
    []
  );

  // Updated getMonthIndex function
  const getMonthIndex = (monthName: string): number => {
    const reversedMonths = [...ethiopianMonths].reverse();
    return reversedMonths.indexOf(monthName);
  };

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

  const devotionsByMonth = previousDevotions.reduce((acc, devotion) => {
    const key = devotion.month;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(devotion);
    return acc;
  }, {} as Record<string, Devotion[]>);

  console.log("Before sorting:", Object.keys(devotionsByMonth));

  const sortedMonths = Object.keys(devotionsByMonth).sort((a, b) => {
    const monthIndexA = getMonthIndex(a);
    const monthIndexB = getMonthIndex(b);

    return monthIndexA - monthIndexB; // Sort in reverse order
  });

  const currentMonth = convertToEthiopianDate(new Date())[1];
  const currentMonthName = ethiopianMonths[currentMonth];
  const currentMonthIndex = sortedMonths.indexOf(currentMonthName);
  const sortedMonthsWithCurrentFirst = [
    ...sortedMonths.slice(currentMonthIndex),
    ...sortedMonths.slice(0, currentMonthIndex),
  ];

  console.log("Final sorted months:", sortedMonthsWithCurrentFirst);

  return (
    <div className="flex flex-col min-h-screen mx-auto" ref={topRef}>
      <div className="w-[100%] h-full font-nokia-bold flex flex-col mx-auto container space-y-6 mb-12 flex-1">
        <CurrentDevotional
          devotionToDisplay={devotionToDisplay}
          showControls={showControls}
          toogleForm={toggleForm}
        />
        <div className="flex flex-col space-y-4">
          {sortedMonthsWithCurrentFirst.map((month) => (
            <MonthFolder
              key={month}
              month={month}
              devotions={devotionsByMonth[month]}
              setSelectedDevotion={setSelectedDevotion}
              isSelected={selectedMonth === month}
              onSelect={() =>
                setSelectedMonth(selectedMonth === month ? null : month)
              }
            />
          ))}
        </div>
        <Categories title="Lessons Available" />
      </div>
    </div>
  );
};

export default DevotionDisplay;
