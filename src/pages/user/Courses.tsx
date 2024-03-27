import CoursesAvailable from "../../features/courses/user/CoursesAvailable";
import Categories from "../../features/courses/user/Categories";
import Footer from "@/components/Footer";

const Courses = () => {
  return (
    <div className="flex flex-col min-h-screen absolute top-0">
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
      <div className="h-auto flex flex-col flex-1 w-[90%]  mx-auto space-y-6 mb-12">
        <CoursesAvailable />
        <Categories title="Categories" />
      </div>
      <Footer />
    </div>
  );
};

export default Courses;
