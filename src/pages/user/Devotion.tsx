import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DevotionDisplay from "@/features/devotions/DevotionDisplay";
import YearSelector from "@/features/devotions/YearSelector";
import Footer from "@/components/Footer";
import { RootState } from "@/redux/store";
import { getCurrentEthiopianYear } from "@/features/devotions/devotionUtils";
import { useGetDevotionPlansQuery } from "@/redux/api-slices/apiSlice";
import { BookBookmark } from "@phosphor-icons/react";

const Devotion = () => {
  const [selectedYear, setSelectedYear] = useState(
    getCurrentEthiopianYear().toString()
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const { data: plansData } = useGetDevotionPlansQuery();
  const plans = plansData?.items || [];

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

      {/* Devotion Plans Section */}
      {plans.length > 0 && (
        <div className="w-11/12 max-w-7xl mx-auto mt-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookBookmark size={32} className="text-accent-6" weight="fill" />
            <div>
              <h2 className="text-3xl font-bold text-secondary-8">Devotion Plans</h2>
              <p className="text-sm text-secondary-6">Start your spiritual journey today</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.slice(0, 6).map((plan: any) => (
              <div
                key={plan._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
                onClick={() => {
                  if (user) {
                    navigate(`/devotion/plan/${plan._id}`);
                  } else {
                    navigate("/login");
                  }
                }}
              >
                {plan.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={plan.image}
                      alt={plan.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-accent-6 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {plan.numItems || 0} days
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary-8 mb-3 group-hover:text-accent-6 transition-colors">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-secondary-6 mb-4 line-clamp-3 leading-relaxed">
                    {plan.description || "Embark on a transformative devotional journey"}
                  </p>
                  <button className="w-full px-6 py-3 rounded-full bg-accent-6 text-white font-bold hover:bg-accent-7 transition-all shadow-md group-hover:shadow-lg">
                    Start Plan →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
      <Footer />
    </div>
  );
};

export default Devotion;
