import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import CurrentDevotional from "./CurrentDevotional";
import Categories from "../../features/courses/user/Categories";
import { 
  useGetMonthsByYearQuery,
  useGetDevotionsByYearAndMonthQuery 
} from "../../redux/api-slices/apiSlice";
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
  const [loadedMonths, setLoadedMonths] = useState<Record<string, Devotion[]>>({});
  const location = useLocation();
  const { selectedDevotion: selectedDevotionFromHome } = location.state || {};
  const user = useSelector((state: RootState) => state.auth.user);

  // Determine which year to load
  const yearToLoad =
    selectedYear === "all" ? getCurrentEthiopianYear() : parseInt(selectedYear);

  // Load only month names for the selected year
  const { data: months, error: monthsError, isLoading: isLoadingMonths } = useGetMonthsByYearQuery(
    yearToLoad
  );

  // Get today's month to load initially - memoize to avoid recreating on every render
  const today = useMemo(() => new Date(), []);
  const [, currentMonthIndex] = convertToEthiopianDate(today);
  const currentMonthName = ethiopianMonths[currentMonthIndex];

  // Filter devotions based on user role - MUST be defined before useEffects that use it
  const filterDevotionsByUserRole = useCallback((devotions: Devotion[]): Devotion[] => {
    const currentYear = getCurrentEthiopianYear();
    const [, currentMonthIdx, currentDay] = convertToEthiopianDate(new Date());
    
    // For non-admin users, filter out future devotions
    if (!user || (user.role !== "Admin" && user.role !== "Instructor")) {
      return devotions.filter(devotion => {
        // Filter by year
        if (devotion.year) {
          if (devotion.year > currentYear) return false;
        }
        
        // Filter by month and day if it's the current month
        const monthIndex = ethiopianMonths.indexOf(devotion.month);
        if (monthIndex === currentMonthIdx && devotion.year === currentYear) {
          return Number(devotion.day) <= currentDay;
        }
        
        return true;
      });
    }

    return devotions;
  }, [user]);

  // Load today's devotion immediately (only the current day, not the whole month)
  // We'll load just today's devotion to show the verse of the day
  const shouldLoadTodayDevotion = 
    months && 
    months.length > 0 && 
    currentMonthName && 
    months.includes(currentMonthName);
  
  const { data: currentMonthDevotions } = useGetDevotionsByYearAndMonthQuery(
    { year: yearToLoad, month: currentMonthName },
    { skip: !shouldLoadTodayDevotion }
  );

  // Load selected month's devotions when clicked
  const { data: selectedMonthDevotions, isLoading: isLoadingSelectedMonth } = useGetDevotionsByYearAndMonthQuery(
    { year: yearToLoad, month: selectedMonth || "" },
    { skip: !selectedMonth || !!loadedMonths[selectedMonth || ""] }
  );

  const topRef = useRef<HTMLDivElement>(null);

  // Don't cache current month data in loadedMonths - only use it for today's devotion
  // We'll only cache months when they're explicitly clicked

  useEffect(() => {
    if (selectedMonthDevotions && selectedMonth) {
      setLoadedMonths(prev => ({
        ...prev,
        [selectedMonth]: selectedMonthDevotions
      }));
    }
  }, [selectedMonthDevotions, selectedMonth]);

  // Store today's devotion separately - this should ALWAYS be shown
  const [todaysDevotion, setTodaysDevotion] = useState<Devotion | null>(null);

  // Set today's devotion from current month (for verse of the day) - ALWAYS show this
  useEffect(() => {
    if (selectedDevotionFromHome) {
      setSelectedDevotion(selectedDevotionFromHome);
      setTodaysDevotion(selectedDevotionFromHome);
      return;
    }

    // Wait for current month to load to show today's devotion
    if (currentMonthDevotions && currentMonthDevotions.length > 0) {
      // Filter to only current year - backend should already do this, but double-check
      const yearFiltered = currentMonthDevotions.filter(devotion => {
        if (devotion.year) {
          return devotion.year === yearToLoad;
        }
        return yearToLoad === 2017; // Legacy devotions
      });
      
      const filteredDevotions = filterDevotionsByUserRole(yearFiltered);
      
      if (filteredDevotions.length > 0) {
        // Try to find today's devotion
        const todayDevotion =
          findDevotion(filteredDevotions, 0, today, yearToLoad) ||
          findDevotion(filteredDevotions, 1, today, yearToLoad) ||
          findDevotion(filteredDevotions, 2, today, yearToLoad) ||
          filteredDevotions[0];

        setTodaysDevotion(todayDevotion);
        // Set as selected devotion if no other devotion is selected
        if (!selectedDevotion) {
          setSelectedDevotion(todayDevotion);
        }
      }
    }
  }, [currentMonthDevotions, selectedDevotionFromHome, yearToLoad, selectedDevotion, filterDevotionsByUserRole, today]);

  // Clear loaded months when year changes, but keep today's devotion
  useEffect(() => {
    setLoadedMonths({});
    setSelectedMonth(null);
    // Don't clear selectedDevotion - keep showing today's devotion
    // Only clear if it's not today's devotion
    if (selectedDevotion && todaysDevotion && selectedDevotion._id !== todaysDevotion._id) {
      setSelectedDevotion(todaysDevotion);
    }
  }, [yearToLoad, selectedDevotion, todaysDevotion]);

  useEffect(() => {
    if (selectedDevotion) {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedDevotion]);

  // Filter months based on user role - MUST be before any early returns
  const filteredMonths = useMemo(() => {
    if (!months || months.length === 0) return [];
    
    if (user && (user.role === "Admin" || user.role === "Instructor")) {
      return months;
    }
    
    // For non-admin users, only show months up to current month
    return months.filter((month: string) => {
      const monthIndex = ethiopianMonths.indexOf(month);
      return monthIndex >= 1 && monthIndex <= currentMonthIndex;
    });
  }, [months, user, currentMonthIndex]);


  // Handle month click - load month data if not already loaded
  const handleMonthClick = (month: string) => {
    if (selectedMonth === month) {
      setSelectedMonth(null);
    } else {
      setSelectedMonth(month);
      // If month data is not loaded, it will be fetched by the query hook
      // The data will be cached in loadedMonths when it arrives
    }
  };

  // Early returns AFTER all hooks
  if (isLoadingMonths) return <LoadingPage />;
  if (monthsError) return `Error: ${(monthsError as Error).message}`;

  if (!months || months.length === 0) {
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

  // Get devotions for a month (from cache or loading state)
  // Filter to only show devotions for the selected year
  const getMonthDevotions = (month: string): Devotion[] => {
    // Only show devotions if this month is explicitly clicked (selected)
    if (selectedMonth !== month) {
      return [];
    }
    
    // If month is loaded, return cached data filtered by year
    if (loadedMonths[month]) {
      // Backend should already filter by year, but ensure we only show selected year
      // Filter out any devotions that don't match the selected year
      const yearFiltered = loadedMonths[month].filter(devotion => {
        if (devotion.year) {
          // Strictly match the year - no other years allowed
          return devotion.year === yearToLoad;
        }
        // Legacy devotions without year field are treated as 2017
        return yearToLoad === 2017;
      });
      
      // Remove duplicates by _id (in case there are any)
      const uniqueDevotions = yearFiltered.filter((devotion, index, self) =>
        index === self.findIndex((d) => d._id === devotion._id)
      );
      
      return filterDevotionsByUserRole(uniqueDevotions);
    }
    
    // If this is the selected month and it's loading, return empty array (will show loading)
    if (isLoadingSelectedMonth) {
      return [];
    }
    
    return [];
  };

  // Sort devotions within each month by descending day
  const getSortedMonthDevotions = (month: string): Devotion[] => {
    const devotions = getMonthDevotions(month);
    return devotions.sort((a, b) => Number(b.day) - Number(a.day));
  };

  return (
    <div className="flex flex-col min-h-screen mx-auto" ref={topRef}>
      <div className="w-[100%] h-full font-nokia-bold flex flex-col mx-auto container space-y-6 mb-12 flex-1">
        {/* Always show today's devotion (verse of the day) */}
        {todaysDevotion && (
          <CurrentDevotional
            devotionToDisplay={todaysDevotion}
            showControls={showControls}
            toogleForm={toggleForm}
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredMonths.map((month: string) => {
            const monthDevotions = getSortedMonthDevotions(month);
            const isExpanded = selectedMonth === month;
            const isLoading = isExpanded && isLoadingSelectedMonth && !loadedMonths[month];
            
            return (
              <MonthFolder
                key={month}
                month={month}
                devotions={monthDevotions}
                setSelectedDevotion={setSelectedDevotion}
                isSelected={isExpanded}
                onSelect={() => handleMonthClick(month)}
                isExpanded={isExpanded}
                isLoading={isLoading}
              />
            );
          })}
        </div>
        <div className="hidden">
          <Categories title="Lessons Available" />
        </div>
      </div>
    </div>
  );
};

export default DevotionDisplay;
