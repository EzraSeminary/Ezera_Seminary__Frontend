import { useState } from "react";
import { useSelector } from "react-redux";
import DevotionDisplay from "@/features/devotions/DevotionDisplay";
import YearSelector from "@/features/devotions/YearSelector";
import { useGetDevotionsQuery } from "@/redux/api-slices/apiSlice";
import Footer from "@/components/Footer";
import LoadingPage from "@/pages/user/LoadingPage";
import { RootState } from "@/redux/store";
import { getCurrentEthiopianYear } from "@/features/devotions/devotionUtils";
// import { Devotion as DevotionType } from "@/redux/types"; // Import the Devotion type

const Devotion = () => {
  const [selectedYear, setSelectedYear] = useState(
    getCurrentEthiopianYear().toString()
  ); // Default to current year
  const user = useSelector((state: RootState) => state.auth.user);

  // Use the useGetDevotionsQuery hook to fetch devotions
  const { data: devotions, error, isLoading } = useGetDevotionsQuery();

  if (isLoading) return <LoadingPage />;
  if (error) return `Error: ${(error as Error).message}`;

  return (
    <div
      className="absolute top-0 w-full font-nokia-bold"
      data-testid="devotion-page"
    >
      <div className="devotion-img bg-cover  w-full py-14  md:py-20 lg:py-28  flex  justify-center items-center pointer-events-none">
        <div className=" z-10 text-primary-1 align-middle font-bold text-center">
          <div className=" text-2xl md:text-5xl">
            Daily <span className="text-accent-6">Devotional</span>
          </div>

          <div className="text-lg md:text-3xl tracking-widest text-accent-6">
            <span className="text-primary-1">የዕለቱ</span> ጥቅስ
          </div>
        </div>
      </div>

      <div className="pt-6">
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          userRole={user?.role || undefined}
        />
      </div>

      <div className=" flex h-full  pt-6  mx-auto flex-1">
        <DevotionDisplay
          devotions={devotions}
          selectedYear={selectedYear}
          showControls={false}
          toggleForm={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Devotion;
