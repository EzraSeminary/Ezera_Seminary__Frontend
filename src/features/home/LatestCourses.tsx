import { useGetCoursesQuery } from "../../services/api";
import { Link } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

{/*typeScript*/ }
interface LatestCourse {
  _id: string;
  title: string;
  description: string;
  image: string;
}

const LatestCourses = () => {

  {/* Fetch the latest courses */ }
  const { data: courses, isLoading } = useGetCoursesQuery({});

  {/* Loading state */ }
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


    </div>
  );
};

export default LatestCourses;
