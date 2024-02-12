// hooks/useCalculateLessonIndex.js

function useCalculateLessonIndex(currentDate) {
  function calculateLessonIndex() {
    const currentDateObj = new Date(currentDate);
    const month = currentDateObj.getMonth() + 1; // Month is zero-based, so we add 1
    const year = currentDateObj.getFullYear();

    // Calculate the quarter
    let quarter;
    if (month >= 1 && month <= 3) {
      quarter = `${year}-01`;
    } else if (month >= 4 && month <= 6) {
      quarter = `${year}-02`;
    } else if (month >= 7 && month <= 9) {
      quarter = `${year}-03`;
    } else {
      quarter = `${year}-04`;
    }

    // Calculate the week within the quarter
    const startQuarter = new Date(year, Math.floor((month - 1) / 3) * 3, 1);
    const diffDays = Math.floor(
      (currentDateObj - startQuarter) / (1000 * 60 * 60 * 24)
    );
    const week = Math.floor(diffDays / 7) + 1;

    return { quarter, week: week.toString().padStart(2, "0") };
  }

  // Just call the function without memoizing
  const lessonIndex = calculateLessonIndex();

  return [lessonIndex.quarter, lessonIndex.week];
}

export default useCalculateLessonIndex;
