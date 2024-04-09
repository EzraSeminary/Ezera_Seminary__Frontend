import { useGetCoursesQuery } from "../../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingPage from "@/pages/user/LoadingPage";

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const gridSquareVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

{
  /*typeScript*/
}

const LatestCourses = () => {
  {
    /* Fetch the latest courses */
  }
  const { data: courses, isLoading } = useGetCoursesQuery();

  {
    /* Loading state */
  }
  if (isLoading) {
    return (
      <>
        {/* Title of the page in the loading state*/}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 w-full mx-auto ">
          <h1 className="text-3xl font-nokia-bold text-secondary-6">
            Latest Courses
          </h1>
          <hr className="border-accent-5 border-1 w-[90%] pb-3" />
        </div>

        {/* Loading spinner */}
        <LoadingPage />
      </>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-4 w-full mx-auto mt-12">
      {/* Title of the page */}
      <h1 className="text-3xl font-nokia-bold text-secondary-6">
        Latest Courses
      </h1>
      <hr className="border-accent-5 border-1 w-[90%] pb-3" />

      {/* Latest Courses */}

      <motion.div
        variants={gridContainerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 w-[90%] lg:w-[70%]"
      >
        {courses?.slice(0, 4).map((course, index: number) => {
          return (
            <motion.div
              variants={gridSquareVariants}
              whileHover={{
                scale: 1.06,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{
                bounceDamping: 10,
                bounceStiffness: 600,
              }}
              key={index}
              className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl  h-full bg-secondary-6 bg-opacity-90 text-center pb-4 font-nokia-bold cursor-pointer"
            >
              <img
                src={`https://ezra-seminary.mybese.tech/images/${course.image}`}
                className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-t-xl bg-secondary-1"
                alt=""
              />
              <h2 className="text-[#fff] font-nokia-bold text-sm xl:text-lg  mt-4 mx-auto md:mx-6 mb-2 ">
                {course.title}
              </h2>
              <Link
                to={`/courses/get/${course._id}`}
                className=" text-accent-6 hover:bg-accent-6  font-nokia-bold border-2 border-accent-6 border-opacity-80 rounded-full px-7 py-1 text-xs hover:text-white transition-all w-max mx-auto block md:mx-6"
              >
                <button type="button">ኮርሱን ክፈት</button>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LatestCourses;
