import { Skeleton } from "@/components/ui/skeleton";
import { MagnifyingGlass } from "@phosphor-icons/react";

const CoursesSkeleton = () => {
  return (
    <div className="container space-y-3 pt-8 ">
      {/* Container of title and seacrch bar*/}

      <div className="flex justify-between items-end">
        {/* Title of the page */}
        <div className="w-full tracking-wide ">
          <h3 className="text-accent-6 text-xs font-Lato-Regular md:text-sm ">
            Explore Programs and Courses
          </h3>
          <h2 className="hidden md:block text-secondary-6 text-sm font-Lato-Regular md:text-sm ">
            Our Most Popular Classes
          </h2>
        </div>
        {/* Search bar */}
        <div className="flex justify-between items-center">
          <div className="flex  ">
            <input
              type="text"
              placeholder="Search"
              className="text-xs text-secondary-6 border border-accent-6 w-auto outline-1 outline-accent-5 rounded-l-lg  px-2 py-1"
            />
            <span className=" self-center cursor-pointer border  rounded-r-lg px-1 py-[0.54rem] -ml-1 bg-accent-6 text-white">
              <MagnifyingGlass size={20} />
            </span>
          </div>
        </div>
      </div>
      <hr className="border-accent-5 border-1 w-[100%] pb-3 md:w-[30%]" />

      {/* Container for Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6 w-[95%] md:gap-4 mx-auto pb-4">
        {"abcdefgh".split("").map((i) => {
          return (
            <div
              key={i}
              className="flex flex-col justify-center items-start w-full shadow-2xl rounded-xl  h-full border-accent-5 border text-center pb-4 font-nokia-bold"
            >
              {/* Image of the course */}
              <div className="w-full p-2 h-full">
                <Skeleton className="w-full max-h-[40vh] min-h-[40vh] md:min-h-[30vh] md:max-h-[30vh] object-cover rounded-xl bg-gray-200 animate-pulse" />
              </div>

              {/* Title, Description and button */}
              <div className=" w-[95%] md:w-[90%] mx-auto h-full">
                <Skeleton className="h-3 mt-1 mx-auto  mb-2  bg-gray-200 animate-pulse rounded" />
                <hr className="border-accent-5 border w-[100%] " />
                <Skeleton className="h-2 mt-2 mb-2  w-[95%] mx-auto bg-gray-200 animate-pulse rounded" />
                <Skeleton className="h-2 mt-2 bg-gray-200 animate-pulse rounded" />
                <Skeleton className="h-2 mt-2 bg-gray-200 animate-pulse rounded" />
                <Skeleton className="h-2 mt-2 w-[20%] mx-auto bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursesSkeleton;
