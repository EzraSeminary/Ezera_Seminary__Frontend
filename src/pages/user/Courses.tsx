import { useState } from "react";
import CoursesAvailable from "../../features/courses/user/CoursesAvailable";
import Categories from "../../features/courses/user/Categories";
import Footer from "@/components/Footer";
import ExploreHome from "@/features/explore/ExploreHome";

const Courses = () => {
  const [activeTab, setActiveTab] = useState<"courses" | "explore">("courses");

  return (
    <div
      className="flex flex-col min-h-screen absolute top-0 w-full font-nokia-bold"
      data-testid="courses-page"
    >
      <div className="course-img bg-cover  w-full py-14  md:py-20 lg:py-28  flex  justify-center items-center pointer-events-none">
        <div className=" z-10 text-primary-1 align-middle font-bold text-center">
          <div className=" text-2xl md:text-5xl">
            Courses <span className="text-accent-6">Available</span>
          </div>

          <div className="text-lg md:text-3xl tracking-widest text-accent-6">
            <span className="text-primary-1">ትምህርቶች</span>
          </div>
        </div>
      </div>
      {/* Tab Navigation (Courses / Explore) */}
      <div className="flex justify-center gap-4 pt-6 px-4">
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-6 py-2 rounded-full font-bold transition-colors ${
            activeTab === "courses"
              ? "bg-accent-6 text-white"
              : "bg-white text-accent-6 border-2 border-accent-6"
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => setActiveTab("explore")}
          className={`px-6 py-2 rounded-full font-bold transition-colors ${
            activeTab === "explore"
              ? "bg-accent-6 text-white"
              : "bg-white text-accent-6 border-2 border-accent-6"
          }`}
        >
          Explore
        </button>
      </div>

      <div className="h-auto flex flex-col flex-1 w-[90%] mx-auto space-y-6 mb-12 pt-6">
        {activeTab === "courses" && (
          <>
            <CoursesAvailable />
            <div className="hidden">
              <Categories title="Categories" />
            </div>
          </>
        )}

        {activeTab === "explore" && <ExploreHome />}
      </div>
      <Footer />
    </div>
  );
};

export default Courses;
