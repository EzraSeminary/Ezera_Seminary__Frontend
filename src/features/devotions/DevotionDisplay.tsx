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
  findDevotionForCurrentYear,
  sortMonths,
  ethiopianMonths,
  getCurrentEthiopianYear,
  getDevotionsForCurrentYear,
  getDisplayYear,
} from "./devotionUtils";
import { RootState } from "@/redux/store";

export interface DevotionDisplayProps {
  showControls: boolean;
  devotions: Devotion[] | undefined;
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
  const { data: devotions, error, isLoading, refetch } = useGetDevotionsQuery();
  const user = useSelector((state: RootState) => state.auth.user);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDevotionFromHome) {
      setSelectedDevotion(selectedDevotionFromHome);
    } else if (devotions && devotions.length > 0) {
      const today = new Date();
      const currentYear = getCurrentEthiopianYear();
      
      // Filter devotions to current year first
      const currentYearDevotions = getDevotionsForCurrentYear(devotions);
      
      // Check if we have year-aware devotions or legacy devotions
      const hasYearFields = devotions.some(d => d.year);
      
      if (!hasYearFields) {
        // Handle legacy devotions without year fields (backward compatibility)
        const [, month] = convertToEthiopianDate(today);
        const ethiopianMonth = ethiopianMonths[month];

        const todaysDevotion =
          findDevotion(devotions, 0, today) ||
          findDevotion(devotions, 1, today) ||
          findDevotion(devotions, 2, today) ||
          devotions.find((devotion) => devotion.month === ethiopianMonth);

        setSelectedDevotion(todaysDevotion || devotions[0]);
      } else if (currentYearDevotions.length > 0) {
        const [, month] = convertToEthiopianDate(today);
        const ethiopianMonth = ethiopianMonths[month];

        // Try to find today's devotion for current year
        const todaysDevotion =
          findDevotionForCurrentYear(currentYearDevotions, 0, today) ||
          findDevotionForCurrentYear(currentYearDevotions, 1, today) ||
          findDevotionForCurrentYear(currentYearDevotions, 2, today) ||
          currentYearDevotions.find(
            (devotion) => 
              devotion.month === ethiopianMonth && 
              (devotion.year === currentYear || !devotion.year)
          );

        setSelectedDevotion(todaysDevotion || currentYearDevotions[0]);
      } else {
        // Fallback to any available devotion if no current year devotions exist
        setSelectedDevotion(devotions[0]);
      }
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

  // Filter devotions based on selected year
  const filterDevotionsBySelectedYear = (devotions: Devotion[]) => {
    // For non-admin users, always show current year devotions
    if (!user || (user.role !== "Admin" && user.role !== "Instructor")) {
      const currentDisplayYear = getDisplayYear();
      return devotions.filter(devotion => {
        if (devotion.year) {
          return devotion.year === currentDisplayYear;
        } else {
          // Legacy devotions without year field are treated as 2017
          return currentDisplayYear === 2017;
        }
      });
    }

    // For admin/instructor users, use selected year
    if (selectedYear === "all") {
      return devotions;
    }
    
    const targetYear = parseInt(selectedYear);
    
    // For existing devotions without year field, treat as 2017 (current year)
    return devotions.filter(devotion => {
      if (devotion.year) {
        return devotion.year === targetYear;
      } else {
        // Legacy devotions without year field are treated as 2017
        return targetYear === 2017;
      }
    });
  };

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

  const previousDevotions = devotionsToShow.filter(
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

  // console.log("Before sorting:", Object.keys(devotionsByMonth));

  const sortedMonthsWithCurrentFirst = sortMonths(devotionsByMonth);

  // Filter devotions to only include the current month if the user is not an admin or instructor
  const today = new Date();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, currentMonth] = convertToEthiopianDate(today);
  const currentMonthName = ethiopianMonths[currentMonth];

  const filteredMonths =
    user && (user.role === "Admin" || user.role === "Instructor")
      ? sortedMonthsWithCurrentFirst
      : [currentMonthName];

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
        <div className="hidden">
        <Categories title="Lessons Available" />
        </div>
      </div>
    </div>
  );
};

export default DevotionDisplay;
