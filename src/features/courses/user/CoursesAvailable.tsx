import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useGetCoursesQuery } from "../../../services/api";
import BeatLoader from "react-spinners/BeatLoader";

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
}

function CoursesAvailable() {
  const { data: courses, error, isLoading } = useGetCoursesQuery({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = courses?.filter((course: Course) => {
    return course.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <BeatLoader
          color={"#707070"}
          loading
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  if (error) {
    let errorMessage = "An unknown error occurred";
    // Check if the error is a `FetchBaseQueryError`
    if ("status" in error) {
      // Error originated from fetchBaseQuery
      errorMessage = `Error: ${error.status}`;
    } else if ("error" in error) {
      // Error is a `SerializedError`
      errorMessage = `Error: ${error.error}`;
    }
    return <div>{errorMessage}</div>;
  }

  return (
    // Courses Available Section
    <div className="space-y-3">
      {/* Container of title and seacrch bar*/}
      <div className="flex justify-between items-end">
        {/* Title of the page */}
        <div>
          <h1 className="text-accent-6 text-2xl font-nokia-bold md:text-4xl tracking-wide">
            Courses Available
          </h1>
          <h3 className="text-accent-6 text-xs font-Lato-Regular md:text-sm tracking-wide">
            Explore Programs and Courses
          </h3>
          <h2 className="text-secondary-6 text-lg font-Lato-Regular md:text-sm tracking-wide">
            Our Most Popular Classes
          </h2>
        </div>
        {/* Search bar */}
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="  md:inline-block  md:border-2  border-accent-6  w-[80%] outline-1 outline-accent-5 rounded-l px-4"
          />
          <span>
            <img
              src="../assets/Search-1.svg"
              alt=""
              className="hidden md:inline-block cursor-pointer"
            />
            <img
              src="../assets/Search.svg"
              alt=""
              className="md:hidden cursor-pointer"
            />
          </span>
        </div>
      </div>
      <hr className="border-accent-5 border-1 w-[100%] pb-3 md:w-[30%]" />

      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6 w-[90%] md:gap-4 mx-auto">
        {filteredData.map((course: Course, index: number) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl  h-full border-accent-5 border-2 text-center pb-4 font-nokia-bold"
            >
              {/* Image of the course */}
              <div className="w-full p-2 h-full">
                <img
                  src={
                    `https://ezra-seminary-api.onrender.com/images/` +
                    course.image
                  }
                  className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-t-xl bg-secondary-1"
                  alt=""
                />
              </div>

              {/* Title, Description and button */}
              <div className=" w-[95%] md:w-[90%] mx-auto h-full">
                <h2 className="text-secondary-6 font-nokia-bold text-sm xl:text-lg  mt-2 mx-auto md:mx-6 mb-2 truncate">
                  {course.title}
                </h2>
                <hr className="border-accent-5 border-1 w-[100%] " />
                <p className="text-secondary-5 text-xs font-nokia-Regular xl:text-lg mt-2 mb-4 line-clamp-3 text-justify  w-[95%] mx-auto">
                  {course.description}
                </p>
                <Link
                  to={`/courses/get/` + course._id}
                  className="bg-accent-6 text-primary-6 px-3 py-1 rounded-full font-nokia-bold text-xs hover:bg-accent-7 "
                >
                  <button className="mt-2" type="button">
                    ኮርሱን ክፈት
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CoursesAvailable;
