import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useGetCoursesQuery } from "../../../services/api";
import BeatLoader from "react-spinners/BeatLoader";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ArrowRight } from "@phosphor-icons/react";
import { ArrowLeft } from "@phosphor-icons/react";

function CoursesAvailable() {
  const { data: courses, error, isLoading } = useGetCoursesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);

  {
    /* function to handle search input */
  }
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  {
    /* function to handle search icon click */
  }
  const handleSearchIconClick = () => {
    setShowInput(!showInput);
  };

  {
    /* Check if the screen is small */
  }
  const isSmallScreen = window.matchMedia("(max-width: 429px)").matches;

  {
    /* Check if the screen is medium */
  }
  const isMediumScreen = window.matchMedia("(max-width: 1023px)").matches;

  {
    /* Filter the data based on the search term */
  }
  const filteredData = (courses ?? []).filter((course) => {
    return course.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  {
    /* Show all courses when the button is clicked */
  }
  const handleViewAllCoursesClick = () => {
    setShowAllCourses(!showAllCourses);
  };

  {
    /* Loading spinner */
  }
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
    <div className="container space-y-3 pt-8 ">
      {/* Container of title and seacrch bar*/}

      <div className="flex justify-between items-end">
        {/* Title of the page */}
        <div className="w-full tracking-wide">
          <h1 className="text-accent-6 text-xl font-nokia-bold md:text-3xl ">
            Courses Available
          </h1>
          <h3 className="text-accent-6 text-xs font-Lato-Regular md:text-sm ">
            Explore Programs and Courses
          </h3>
          <h2 className="hidden md:block text-secondary-6 text-sm font-Lato-Regular md:text-sm ">
            Our Most Popular Classes
          </h2>
        </div>
        {/* Search bar */}
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

      {/* Container for Courses */}
      {isSmallScreen ? (
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 w-[95%] md:gap-4 mx-auto pb-4">
          {filteredData
            .slice(0, showAllCourses ? filteredData.length : 4)
            .map((course, index: number) => {
              return (
                <div
                  key={index}
                  className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl  h-full border-accent-5 border text-center pb-4 font-nokia-bold"
                >
                  {/* Image of the course */}
                  <div className="w-full p-2 h-full">
                    <img
                      src={
                        `https://ezra-seminary.mybese.tech/images/` +
                        course.image
                      }
                      className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-xl bg-secondary-1"
                      alt=""
                    />
                  </div>

                  {/* Title, Description and button */}
                  <div className=" w-[95%] md:w-[90%] mx-auto h-full">
                    <h2 className="text-secondary-6 font-nokia-bold text-sm xl:text-lg mt-1 mx-auto  mb-2 truncate">
                      {course.title}
                    </h2>
                    <hr className="border-accent-5 border w-[100%] " />
                    <p className="text-secondary-5 text-xs font-nokia-Regular xl:text-lg mt-2 mb-2 line-clamp-3 text-justify  w-[95%] mx-auto leading-tight">
                      {course.description}
                    </p>
                    <Link
                      to={`/courses/get/` + course._id}
                      className="bg-accent-6 text-primary-6 px-3 py-1 rounded-full font-nokia-bold text-xs hover:bg-accent-7 trnsition-all"
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
      ) : isMediumScreen ? (
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 w-[95%] md:gap-4 mx-auto pb-4">
          {filteredData
            .slice(0, showAllCourses ? filteredData.length : 6)
            .map((course, index: number) => {
              return (
                <div
                  key={index}
                  className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl  h-full border-accent-5 border text-center pb-4 font-nokia-bold"
                >
                  {/* Image of the course */}
                  <div className="w-full p-2 h-full">
                    <img
                      src={
                        `https://ezra-seminary.mybese.tech/images/` +
                        course.image
                      }
                      className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-xl bg-secondary-1"
                      alt=""
                    />
                  </div>

                  {/* Title, Description and button */}
                  <div className=" w-[95%] md:w-[90%] mx-auto h-full">
                    <h2 className="text-secondary-6 font-nokia-bold text-sm xl:text-lg mt-1 mx-auto  mb-2 truncate">
                      {course.title}
                    </h2>
                    <hr className="border-accent-5 border w-[100%] " />
                    <p className="text-secondary-5 text-xs font-nokia-Regular xl:text-lg mt-2 mb-2 line-clamp-3 text-justify  w-[95%] mx-auto leading-tight">
                      {course.description}
                    </p>
                    <Link
                      to={`/courses/get/` + course._id}
                      className="bg-accent-6 text-primary-6 px-3 py-1 rounded-full font-nokia-bold text-xs hover:bg-accent-7 trnsition-all"
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 w-[95%] md:gap-4 mx-auto pb-4">
          {filteredData
            .slice(0, showAllCourses ? filteredData.length : 8)
            .map((course, index: number) => {
              return (
                <div
                  key={index}
                  className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl  h-full border-accent-5 border text-center pb-4 font-nokia-bold"
                >
                  {/* Image of the course */}
                  <div className="w-full p-2 h-full">
                    <img
                      src={
                        `https://ezra-seminary-api.onrender.com/images/` +
                        course.image
                      }
                      className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-xl bg-secondary-1"
                      alt=""
                    />
                  </div>

                  {/* Title, Description and button */}
                  <div className=" w-[95%] md:w-[90%] mx-auto h-full">
                    <h2 className="text-secondary-6 font-nokia-bold text-sm xl:text-lg mt-1 mx-auto  mb-2 truncate">
                      {course.title}
                    </h2>
                    <hr className="border-accent-5 border w-[100%] " />
                    <p className="text-secondary-5 text-xs font-nokia-Regular xl:text-lg mt-2 mb-2 line-clamp-3 text-justify  w-[95%] mx-auto leading-tight">
                      {course.description}
                    </p>
                    <Link
                      to={`/courses/get/` + course._id}
                      className="bg-accent-6 text-primary-6 px-3 py-1 rounded-full font-nokia-bold text-xs hover:bg-accent-7 trnsition-all"
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
      )}

      {/* Button to view all courses */}
      {showAllCourses ? (
        <div
          className="flex items-center justify-between border-accent-5 border w-max rounded-3xl px-3 py-1 gap-2 "
          onClick={handleViewAllCoursesClick}
        >
          <ArrowLeft
            size={22}
            className="text-white bg-accent-6 border p-1 rounded-lg"
          />
          <button className="text-accent-6 text-xs font-nokia-bold">
            ተመለስ
          </button>
        </div>
      ) : (
        <div
          className="flex items-center justify-between border-accent-5 border w-max rounded-3xl px-3 py-1 gap-2 "
          onClick={handleViewAllCoursesClick}
        >
          <button className="text-accent-6 text-xs font-nokia-bold">
            ሙሉ ተመልከት
          </button>
          <ArrowRight
            size={25}
            className="text-white bg-accent-6 border p-1 rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

export default CoursesAvailable;
