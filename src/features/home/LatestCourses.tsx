import { useGetCoursesQuery } from "../../services/api";
import { Link } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

{
  /*typeScript*/
}
interface LatestCourse {
  _id: string;
  title: string;
  description: string;
  image: string;
}

const LatestCourses = () => {
  {
    /* Fetch the latest courses */
  }
  const { data: courses, isLoading } = useGetCoursesQuery({});

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
        <div className="h-screen flex justify-center items-center">
          <BeatLoader
            color={"#707070"}
            loading
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      </>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-4 w-full mx-auto ">
      {/* Title of the page */}
      <h1 className="text-3xl font-nokia-bold text-secondary-6">
        Latest Courses
      </h1>
      <hr className="border-accent-5 border-1 w-[90%] pb-3" />

      {/* Latest Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 w-[90%] lg:w-[70%]">
        {courses?.slice(0, 4).map((course: LatestCourse, index: number) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl  h-full bg-secondary-6 bg-opacity-90 text-center pb-4 font-nokia-bold"
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
                className=" text-accent-6 hover:bg-accent-6  font-nokia-bold border-2 border-accent-6 border-opacity-80 rounded-full px-7 py-1 text-xs1 hover:text-white transition-all w-max mx-auto block md:mx-6"
              >
                <button type="button">ኮርሱን ክፈት</button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LatestCourses;
