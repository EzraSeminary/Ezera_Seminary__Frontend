import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetCoursesQuery } from "../../../services/coursesApi";
import BeatLoader from "react-spinners/BeatLoader";

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
}

function CoursesAvailable() {
  const { data: courses, error, isLoading } = useGetCoursesQuery();
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
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
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

      <div className="flex flex-col justify-center items-center md:items-start w-[90%] mx-auto md:w-[98%] md:flex-row md:justify-start md:flex-wrap space-y-6 md:space-y-0 md:gap-4 ">
        {filteredData.map((course: Course, index: number) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-center items-start  border-accent-5 border-2 w-[100%] md:w-[23.7%] shadow-xl rounded-3xl md:rounded-xl h-auto pb-6"
            >
              <div className="w-full p-2">
                <img
                  src={
                    `https://ezra-seminary-api.onrender.com/images/` +
                    course.image
                  }
                  className="w-full max-h-[40vh] min-h-[40vh]  md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-3xl md:rounded-2xl bg-secondary-1"
                  alt=""
                />
              </div>
              <div className="space-y-2 w-[95%] md:w-[90%] mx-auto">
                <h2 className="text-secondary-6 text-xl font-nokia-bold w-[90%] truncate">
                  {course.title}
                </h2>
                <hr className="border-accent-5 border-1 w-[100%] " />
                <p className="text-secondary-5 text-xs font-nokia-bold   w-[100%]  line-clamp-3  text-justify">
                  {course.description}
                </p>
                <Link
                  to={`/courses/get/` + course._id}
                  className="bg-accent-6 text-primary-6 px-3 py-1 rounded-full font-nokia-bold text-xs hover:bg-accent-7"
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
