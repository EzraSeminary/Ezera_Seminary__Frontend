// Devotion.tsx
import DevotionDisplay from "@/features/devotions/DevotionDisplay";
import {
  useGetTodayDevotionQuery,
  useGetDevotionsByMonthQuery,
} from "@/redux/api-slices/apiSlice";
import Footer from "@/components/Footer";
import LoadingPage from "@/pages/user/LoadingPage";
import {
  convertToEthiopianDate,
  ethiopianMonths,
} from "@/features/devotions/devotionUtils";

const Devotion = () => {
  // Fetch today's devotion
  const {
    data: todayDevotion,
    error: todayError,
    isLoading: todayLoading,
  } = useGetTodayDevotionQuery();

  // Utility function to get current Ethiopian month
  const getCurrentEthiopianMonth = (): string => {
    const today = new Date();
    const [year, month, day] = convertToEthiopianDate(today);
    return ethiopianMonths[month - 1]; // Corrected based on updated ethiopianMonths
  };

  const currentMonth = getCurrentEthiopianMonth();

  // Fetch current month's devotions
  const {
    data: currentMonthDevotions,
    error: monthError,
    isLoading: monthLoading,
  } = useGetDevotionsByMonthQuery(currentMonth);

  if (todayLoading || monthLoading) return <LoadingPage />;
  if (todayError) {
    console.error("Error fetching today's devotion:", todayError);
    return <div>Error: {todayError.message}</div>;
  }
  if (monthError) {
    console.error("Error fetching month's devotions:", monthError);
    return <div>Error: {monthError.message}</div>;
  }

  return (
    <div className="absolute top-0 w-full font-nokia-bold">
      <div className="devotion-img bg-cover w-full py-14 md:py-20 lg:py-28 flex justify-center items-center pointer-events-none">
        <div className="z-10 text-primary-1 align-middle font-bold text-center">
          <div className="text-2xl md:text-5xl">
            Daily <span className="text-accent-6">Devotional</span>
          </div>

          <div className="text-lg md:text-3xl tracking-widest text-accent-6">
            <span className="text-primary-1">የዕለቱ</span> ጥቅስ
          </div>
        </div>
      </div>

      <div className="flex h-full pt-12 mx-auto flex-1">
        <DevotionDisplay
          todayDevotion={todayDevotion}
          currentMonthDevotions={currentMonthDevotions}
          showControls={false}
          toggleForm={() => {}}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Devotion;
