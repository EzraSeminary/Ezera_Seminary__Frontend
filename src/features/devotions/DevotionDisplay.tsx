import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import CurrentDevotional from "./CurrentDevotional";
import Categories from "../../features/courses/user/Categories";
import { useGetDevotionsByYearQuery } from "../../redux/api-slices/apiSlice";
import { Devotion } from "@/redux/types";
import LoadingPage from "@/pages/user/LoadingPage";
import MonthFolder from "./MonthFolder";
import {
  convertToEthiopianDate,
  findDevotion,
  ethiopianMonths,
  getCurrentEthiopianYear,
} from "./devotionUtils";
import { RootState } from "@/redux/store";

export interface DevotionDisplayProps {
  showControls: boolean;
  selectedYear?: string;
  toggleForm: () => void;
}

const DevotionDisplay: React.FC<DevotionDisplayProps> = ({
  showControls,
  selectedYear = "all",
  toggleForm,
}) => {
  const [selectedDevotion, setSelectedDevotion] = useState<Devotion | null>(
    null
  );
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const location = useLocation();
  const { selectedDevotion: selectedDevotionFromHome } = location.state || {};
  const user = useSelector((state: RootState) => state.auth.user);

  // Determine which year to load
  const yearToLoad =
    selectedYear === "all" ? getCurrentEthiopianYear() : parseInt(selectedYear);
  const { data: devotions, error, isLoading, refetch } = useGetDevotionsByYearQuery(
    yearToLoad
  );

  const topRef = useRef<HTMLDivElement>(null);

  // Filter devotions based on selected year and user role
  const filterDevotionsBySelectedYear = (devotions: Devotion[]) => {
    const currentYear = getCurrentEthiopianYear();
    
    // For non-admin users, ONLY show current year devotions (never future years)
    if (!user || (user.role !== "Admin" && user.role !== "Instructor")) {
      return devotions.filter(devotion => {
        if (devotion.year) {
          // Only show devotions for current year or past years, never future
          return devotion.year <= currentYear;
        } else {
          // Legacy devotions without year field are treated as current year (2017)
          return true;
        }
      });
    }

    // For admin/instructor users, use selected year
    if (selectedYear === "all") {
      return devotions;
    }
    
    const targetYear = parseInt(selectedYear);
    
    // Filter by specific year for admin/instructor
    return devotions.filter(devotion => {
      if (devotion.year) {
        return devotion.year === targetYear;
      } else {
        // Legacy devotions without year field are treated as 2017
        return targetYear === 2017;
      }
    });
  };

  useEffect(() => {
    if (selectedDevotionFromHome) {
      setSelectedDevotion(selectedDevotionFromHome);
    } else if (devotions && devotions.length > 0) {
      const today = new Date();
      
      // Apply year filtering first
      const filteredDevotions = filterDevotionsBySelectedYear(devotions);
      
      if (filteredDevotions.length === 0) {
        setSelectedDevotion(null);
        return;
      }
      
      const [, month] = convertToEthiopianDate(today);
      const ethiopianMonth = ethiopianMonths[month];

      // Try to find today's devotion from filtered devotions
      const todaysDevotion =
        findDevotion(filteredDevotions, 0, today) ||
        findDevotion(filteredDevotions, 1, today) ||
        findDevotion(filteredDevotions, 2, today) ||
        filteredDevotions.find((devotion) => devotion.month === ethiopianMonth);

      setSelectedDevotion(todaysDevotion || filteredDevotions[0]);
    }
  }, [devotions, selectedDevotionFromHome, selectedYear, user]);

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

  const devotionsToShow = devotions ? filterDevotionsBySelectedYear(devotions) : [];
  const devotionToDisplay = selectedDevotion || devotionsToShow[0];

  // Show message if no devotions found for selected year
  if (devotionsToShow.length === 0) {
    return (
      <div className="flex flex-col min-h-screen mx-auto">
        <div className="w-[100%] h-full font-nokia-bold flex flex-col mx-auto container space-y-6 mb-12 flex-1">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-bold text-accent-6 mb-4">
              ጥቅስ አልተገኘም
            </h2>
            <p className="text-gray-600 mb-4">
              {selectedYear === "all" 
                ? "በመረጃ ቋቱ ውስጥ ምንም ጥቅስ የለም።"
                : `ለ${selectedYear} ዓመት ምንም ጥቅስ አልተገኘም።`}
            </p>
            {selectedYear === "2018" && (
              <p className="text-sm text-blue-600">
                የ2018 ዓመት ጥቅሶች ገና አልተጨመሩም። በፎርሙ በመጠቀም ማከል ይችላሉ።
              </p>
            )}
            {showControls && (
              <button
                onClick={toggleForm}
                className="bg-accent-6 hover:bg-accent-7 text-white px-6 py-2 rounded-md mt-4"
              >
                አዲስ ጥቅስ ጨምር
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }



  // Use filtered devotions instead of all devotions for month grouping
  const devotionsByMonth = devotionsToShow.reduce((acc, devotion) => {
    const key = devotion.month;
    if (!acc[key]) acc[key] = [];
    acc[key].push(devotion);
    return acc;
  }, {} as Record<string, Devotion[]>);

  // Get today's Ethiopian date [year, month, day]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, currentMonthIndex, currentDay] = convertToEthiopianDate(new Date());

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
    devotionsByMonth[month] = devotionsByMonth[month].sort((a, b) => 
      Number(b.day) - Number(a.day)
    );
  }

  // Sort months (Meskerem -> Pagume)
  const sortedMonths = Object.keys(devotionsByMonth).sort((a, b) => {
    const aIndex = ethiopianMonths.indexOf(a);
    const bIndex = ethiopianMonths.indexOf(b);
    return aIndex - bIndex;
  });

  // For non-admin/instructor, only show months from Meskerem (index 1) up to currentMonthIndex
  const filteredMonths =
    user && (user.role === "Admin" || user.role === "Instructor")
      ? sortedMonths
      : sortedMonths.filter((month: string) => {
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
          {filteredMonths.map((month: string) => (
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
        <div className="hidden">
          <Categories title="Lessons Available" />
        </div>
      </div>
    </div>
  );
};

export default DevotionDisplay;
