import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useGetCoursesQuery } from "../../../services/api";
import BeatLoader from "react-spinners/BeatLoader";
import useAxiosInstance from "../../../api/axiosInstance";

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
}

function ManageCourse() {
  const { data: courses, error, isLoading } = useGetCoursesQuery({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = courses?.filter((course: Course) => {
    return course.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const instance = useAxiosInstance();

  // delete property
  const handleDelete = (id: string) => {
    instance
      .delete("/course/delete/" + id)
      .then((res) => {
        window.location.reload();
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

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
  if (error) return <div>Something went wrong.</div>;

  return (
    <div className="h-auto flex flex-col border border-gray-300 p-11 rounded-3xl mt-12 space-y-12 mb-12">
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-accent-6 text-xl font-nokia-bold md:text-2xl tracking-wide">
              Manage Courses
            </h1>
          </div>
          <div className="flex justify-end">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              className="md:inline-block  md:border-2  border-accent-6  w-[80%] outline-1 outline-accent-5 rounded-l px-4"
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
                className="flex flex-col justify-center items-start  border-accent-5 border-2 w-[100%] md:w-[23.7%] shadow-xl rounded-3xl md:rounded-xl h-auto pb-6 "
              >
                <div className="w-full p-2">
                  <img
                    src={
                      `https://ezra-seminary-api.onrender.com/images/` +
                      course.image
                    }
                    // src={`http://localhost:5100/images/` + course.image}
                    className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-3xl md:rounded-2xl bg-secondary-1"
                    alt=""
                  />
                </div>
                <div className="space-y-2 w-[95%] md:w-[90%] mx-auto">
                  <h2 className="text-secondary-6 text-xl font-nokia-bold w-[90%] truncate">
                    {course.title}
                  </h2>
                  <p className="text-secondary-5 text-xs font-nokia-bold   w-[100%]  line-clamp-3  text-justify">
                    {course.description}
                  </p>
                  <hr className="border-accent-5 border-1 w-[100%] " />
                  <div className="flex justify-between">
                    <Link
                      to={`/admin/edit/course/` + course._id + `/chapters`}
                      className="inline-block bg-accent-6 text-primary-6 px-3 py-1 rounded transition duration-300 focus:outline-none font-nokia-bold text-xs hover:bg-accent-7"
                    >
                      edit
                    </Link>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="inline-block bg-red-500 hover:bg-red-600 text-white font-nokia-bold text-xs py-1 px-3 rounded transition duration-300 focus:outline-none"
                    >
                      delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ManageCourse;
