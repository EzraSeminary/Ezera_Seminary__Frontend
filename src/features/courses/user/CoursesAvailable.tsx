import { useState, ChangeEvent, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useGetCoursesQuery } from "@/services/api";
import { MagnifyingGlass, ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import { Progress } from "@/components/ui/progress";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CoursesSkeleton from "@/skeletons/CoursesSkeleton";

const gridSquareVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

function CoursesAvailable() {
  const { data: courses, error, isLoading } = useGetCoursesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchIconClick = () => {
    setShowInput((prev) => !prev);
  };

  const isSmallScreen = window.matchMedia("(max-width: 429px)").matches;
  const isMediumScreen = window.matchMedia("(max-width: 1023px)").matches;

  const filteredData = useMemo(
    () =>
      (courses || [])
        .filter((course) => {
          const isAdmin = currentUser && currentUser.role === "Admin";
          return (
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (isAdmin || course.published)
          );
        })
        .reverse(),
    [courses, searchTerm, currentUser]
  );

  const handleViewAllCoursesClick = () => {
    setShowAllCourses((prev) => !prev);
  };

  const getProgressValue = (courseId: string): number | undefined => {
    const userProgress = currentUser?.progress?.find(
      (p) => p.courseId === courseId
    );
    const totalChapter = courses?.find((course) => course._id === courseId)
      ?.chapters.length;

    if (userProgress && totalChapter) {
      const currentChapterCount = (userProgress.currentChapter ?? 0) + 1;
      const progressDecimal = currentChapterCount / totalChapter;
      return progressDecimal * 100;
    }
    return undefined;
  };

  if (isLoading) return <CoursesSkeleton />;

  if (error) {
    const errorMessage =
      "status" in error
        ? `Error: ${error.status}`
        : "error" in error
        ? `Error: ${error.error}`
        : "An unknown error occurred";

    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-nokia-bold text-secondary-10 pb-3">
          {errorMessage}
        </h1>
        <Link
          to="/"
          className="text-white text-xl font-nokia-bold bg-black hover:bg-gray-900 px-3 py-1 rounded-3xl transition-all"
        >
          back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container space-y-3 pt-8 ">
      <div className="flex justify-between items-end">
        <div className="w-full tracking-wide ">
          <h3 className="text-accent-6 text-xs font-Lato-Regular md:text-sm ">
            Explore Programs and Courses
          </h3>
          <h2 className="hidden md:block text-secondary-6 text-sm font-Lato-Regular md:text-sm ">
            Our Most Popular Classes
          </h2>
        </div>
        <div className="flex justify-between items-center">
          {isSmallScreen ? (
            <div className="flex items-center justify-end">
              {showInput && (
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="text-xs text-secondary-6 border border-accent-6 w-[50%] outline-1 outline-accent-5 rounded-l-lg  px-2 py-1"
                />
              )}
              <span
                className="cursor-pointer border  rounded-r-lg px-1 py-[0.4rem] -ml-1 bg-accent-6 text-white block"
                onClick={handleSearchIconClick}
              >
                <MagnifyingGlass size={20} />
              </span>
            </div>
          ) : (
            <div className="flex  ">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="text-xs text-secondary-6 border border-accent-6 w-auto outline-1 outline-accent-5 rounded-l-lg  px-2 py-1"
              />
              <span
                className=" self-center cursor-pointer border  rounded-r-lg px-1 py-[0.54rem] -ml-1 bg-accent-6 text-white"
                onClick={handleSearchIconClick}
              >
                <MagnifyingGlass size={20} />
              </span>
            </div>
          )}
        </div>
      </div>
      <hr className="border-accent-5 border-1 w-[100%] pb-3 md:w-[30%]" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {filteredData.length > 0 &&
          filteredData.slice(0, isSmallScreen ? 4 : isMediumScreen ? 6 : 8).map((course, index) => (
            <CourseCard
              key={index}
              course={{
                _id: course._id,
                title: course.title,
                description: course.description,
                image: course.image,
                published: course.published,
                chapters: course.chapters,
              }}
              progressValue={getProgressValue(course._id)}
            />
          ))}
      </div>

      <div
        className="flex items-center justify-between border-accent-5 border w-max rounded-3xl px-3 py-1 gap-2 "
        onClick={handleViewAllCoursesClick}
      >
        {showAllCourses ? (
          <>
            <ArrowLeft
              size={22}
              className="text-white bg-accent-6 border p-1 rounded-lg"
            />
            <button className="text-accent-6 text-xs font-nokia-bold">
              ተመለስ
            </button>
          </>
        ) : (
          <>
            <button className="text-accent-6 text-xs font-nokia-bold">
              ሙሉ ተመልከት
            </button>
            <ArrowRight
              size={25}
              className="text-white bg-accent-6 border p-1 rounded-lg"
            />
          </>
        )}
      </div>
    </div>
  );
}

const CourseCard: React.FC<{
  course: {
    _id: string;
    title: string;
    description: string;
    image: string | File;
    published: boolean;
    chapters: { _id: string }[];
  };
  progressValue: number | undefined;
}> = ({ course, progressValue }) => {
  return (
    <motion.div
      variants={gridSquareVariants}
      className="flex flex-col  items-start w-full shadow-2xl rounded-xl  h-full border-accent-5 border pb-4 font-nokia-bold"
    >
      <div className="w-full p-2 h-full">
        <img
          src={
            typeof course.image === "string"
              ? course.image
              : URL.createObjectURL(course.image)
          }
          className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-tl-xl rounded-tr-xl bg-secondary-1"
          alt=""
        />
      </div>

      <Progress value={progressValue || 0} className="w-[90%] mx-auto" />

      <div className=" w-[95%] md:w-[90%] mx-auto h-[100%] flex-col justify-between">
        <h2 className="text-secondary-6 font-nokia-bold text-lg xl:text-2xl mt-1 mx-auto  mb-2 line-clamp-2">
          {course.title}
        </h2>
        <div>
        <hr className="border-accent-5 border w-[100%] " />
        <p className="text-secondary-5 text-xs font-nokia-Regular xl:text-sm mt-2 mb-2 line-clamp-3  w-[95%] mx-auto leading-tight">
          {course.description}
        </p>
        <Link
          to={`/courses/get/` + course._id}
          className="bg-accent-6 text-primary-1 px-6 py-1.5 rounded-full font-nokia-bold text-xs hover:bg-accent-7 transition-all"
        >
          <button className="mt-2" type="button">
            ኮርሱን ክፈት
          </button>
        </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CoursesAvailable;