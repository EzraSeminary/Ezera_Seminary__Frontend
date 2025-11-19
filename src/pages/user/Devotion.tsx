import { useState } from "react";
import { useSelector } from "react-redux";
import DevotionDisplay from "@/features/devotions/DevotionDisplay";
import YearSelector from "@/features/devotions/YearSelector";
import Footer from "@/components/Footer";
import { RootState } from "@/redux/store";
import { getCurrentEthiopianYear } from "@/features/devotions/devotionUtils";
import DevotionPlans from "@/features/devotionPlans/DevotionPlans";

const Devotion = () => {
  const [selectedYear, setSelectedYear] = useState(
    getCurrentEthiopianYear().toString()
  ); // Default to current year
  const [activeTab, setActiveTab] = useState<"daily" | "plans">("daily");
  const user = useSelector((state: RootState) => state.auth.user);

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

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4 pt-6 px-4">
        <button
          onClick={() => setActiveTab("daily")}
          className={`px-6 py-2 rounded-full font-bold transition-colors ${
            activeTab === "daily"
              ? "bg-accent-6 text-white"
              : "bg-white text-accent-6 border-2 border-accent-6"
          }`}
        >
          Daily Devotion
        </button>
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-6 py-2 rounded-full font-bold transition-colors ${
            activeTab === "plans"
              ? "bg-accent-6 text-white"
              : "bg-white text-accent-6 border-2 border-accent-6"
          }`}
        >
          Devotion Plans
        </button>
      </div>

      {activeTab === "daily" && (
        <>
          <div className="pt-6">
            <YearSelector
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              userRole={user?.role || undefined}
            />
          </div>

          <div className=" flex h-full  pt-6  mx-auto flex-1">
            <DevotionDisplay
              selectedYear={selectedYear}
              showControls={false}
              toggleForm={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </>
      )}

      {activeTab === "plans" && (
        <div className="pt-6 px-4 max-w-7xl mx-auto mt-16 lg:mt-20 xl:mt-24">
          <DevotionPlans />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Devotion;
