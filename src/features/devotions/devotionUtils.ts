import { EthDateTime } from "ethiopian-calendar-date-converter";
import { Devotion } from "@/types/devotionTypes";

export const ethiopianMonths = [
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

export const findDevotion = (
  devotions: Devotion[],
  offset: number,
  today: Date
): Devotion | undefined => {
  const date = new Date(today);
  date.setDate(today.getDate() - offset);
  const [, m, d] = convertToEthiopianDate(date);
  const monthName = ethiopianMonths[m];
  console.log(`Checking for devotion on: ${monthName} ${d}`);
  return devotions.find(
    (devotion) => devotion.month === monthName && Number(devotion.day) === d
  );
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

export const sortDevotionsByDayDescending = (devotions: Devotion[]) => {
  return devotions.sort((a, b) => {
    const dayA = Number(a.day);
    const dayB = Number(b.day);
    return dayB - dayA; // Descending order
  });
};

export const sortMonthsChronologically = (
  devotionsByMonth: Record<string, Devotion[]>
) => {
  const sortedMonths = Object.keys(devotionsByMonth).sort((a, b) => {
    const monthIndexA = ethiopianMonths.indexOf(a);
    const monthIndexB = ethiopianMonths.indexOf(b);
    return monthIndexA - monthIndexB;
  });
  return sortedMonths;
};
