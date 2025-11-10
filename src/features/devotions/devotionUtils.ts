import { EthDateTime } from "ethiopian-calendar-date-converter";
import { Devotion } from "@/redux/types";

export const ethiopianMonths = [
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
];

export const convertToEthiopianDate = (date: Date) => {
  const ethDateTime = EthDateTime.fromEuropeanDate(date);
  return [ethDateTime.year, ethDateTime.month, ethDateTime.date];
};

export const getMonthIndex = (monthName: string): number => {
  const reversedMonths = [...ethiopianMonths].reverse();
  return reversedMonths.indexOf(monthName);
};

export const getCurrentEthiopianYear = (): number => {
  const today = new Date();
  const [year] = convertToEthiopianDate(today);
  return year;
};

export const getDisplayYear = (): number => {
  // This function returns which year should be displayed by default
  // When new year comes (2018), it will automatically return 2018
  const currentYear = getCurrentEthiopianYear();
  
  // For now, we're in 2017, but this will automatically switch to 2018 when the time comes
  return currentYear;
};

export const findDevotion = (
  devotions: Devotion[],
  offset: number,
  today: Date,
  targetYear?: number
): Devotion | undefined => {
  const date = new Date(today);
  date.setDate(today.getDate() - offset);
  const [year, m, d] = convertToEthiopianDate(date);
  const monthName = ethiopianMonths[m];
  const searchYear = targetYear || year;
  
  // console.log(`Checking for devotion on: ${monthName} ${d}, ${searchYear}`);
  return devotions.find(
    (devotion) => 
      devotion.month === monthName && 
      Number(devotion.day) === d &&
      (devotion.year === searchYear || !devotion.year) // Handle legacy devotions without year
  );
};

export const findDevotionForCurrentYear = (
  devotions: Devotion[],
  offset: number,
  today: Date
): Devotion | undefined => {
  return findDevotion(devotions, offset, today, getCurrentEthiopianYear());
};

export const sortMonths = (devotionsByMonth: Record<string, Devotion[]>) => {
  const sortedMonths = Object.keys(devotionsByMonth).sort((a, b) => {
    const monthIndexA = getMonthIndex(a);
    const monthIndexB = getMonthIndex(b);
    return monthIndexA - monthIndexB; // Sort in reverse order
  });

  const currentMonth = convertToEthiopianDate(new Date())[1];
  const currentMonthName = ethiopianMonths[currentMonth];
  const currentMonthIndex = sortedMonths.indexOf(currentMonthName);
  return [
    ...sortedMonths.slice(currentMonthIndex),
    ...sortedMonths.slice(0, currentMonthIndex),
  ];
};

export const filterDevotionsByYear = (
  devotions: Devotion[],
  year: number
): Devotion[] => {
  return devotions.filter((devotion) => devotion.year === year || !devotion.year); // Include legacy devotions
};

export const getDevotionsForCurrentYear = (devotions: Devotion[]): Devotion[] => {
  const currentYear = getCurrentEthiopianYear();
  // If we have devotions with years, filter by current year
  // If we only have legacy devotions (no year), return all of them
  const devotionsWithYear = devotions.filter(d => d.year);

  
  if (devotionsWithYear.length > 0) {
    return filterDevotionsByYear(devotions, currentYear);
  } else {
    // Return all devotions if none have year fields (backward compatibility)
    return devotions;
  }

};
