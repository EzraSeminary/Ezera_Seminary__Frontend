import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => {
  return (
    <div className="absolute top-0 w-full">
      <div className="loggedIn-img bg-cover  w-full py-14  md:py-20 lg lg:py-28  flex  justify-center items-center pointer-events-none">
        <div className=" z-10 text-primary-1 align-middle font-bold text-center">
          <div className=" text-2xl md:text-5xl">
            Welcome <span className="text-accent-6">Back</span>
          </div>
          <div className="text-lg md:text-3xl text-accent-6">እንኳን ደህና መጣችሁ</div>
        </div>
      </div>

      <div className="w-[90%]  space-y-12 py-12 font-nokia-bold text-secondary-6 mx-auto lg:w-[90%] lg:space-y-20 lg:py-16 xl:py-24 flex-1">
        {/*daily devotions and course */}
        <div className="grid grid-cols-1 space-y-6  items-start justify-start w-full gap-2 md:grid-cols-2 md:space-y-0  lg:w-[85%] xl:w-[90%] mx-auto">
          {/* daily devotionals conatiner*/}
          <div className="w-[90%] mx-auto ">
            <p className="text-lg lg:text-xl xl:text-3xl  text-accent-6 border-b border-accent-6 pb-2 lg:w-[50%]">
              Daily<span className="text-secondary-6"> Devotionals</span>
            </p>
            {/* Today's verse */}

            <div className=" w-[90%] mx-auto flex flex-col h-full border border-accent-6 mt-6 rounded-lg bg-primary-2 shadow-2xl p-4  space-y-4 cursor-pointer">
              <div className="h-48  lg:h-52  xl:h-64">
                <Skeleton className="w-full  h-full object-cover rounded-lg bg-gray-200 animate-pulse" />
              </div>
              <div className="space-y-2 lg:space-y-3 h-full">
                <div className="flex flex-row w-[100%] justify-between items-center">
                  <Skeleton className=" h-2  w-[60%] bg-gray-200 rounded animate-pulse" />
                  <Skeleton className=" h-2  w-[20%] bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="border-b border-accent-6 mt-2 mb-1 " />
                <div className="space-y-2">
                  <Skeleton className="h-2  flex-grow bg-gray-200 rounded animate-pulse" />
                  <Skeleton className="h-2 flex-grow bg-gray-200 rounded animate-pulse" />
                  <Skeleton className="h-2 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Discover Courses Container*/}
          <div className="w-[90%] mx-auto ">
            {/* Continue studying */}
            <div className="flex flex-row justify-between items-center border-b border-accent-6 pb-1">
              <p className="text-lg lg:text-xl xl:text-3xl">
                <span className="text-accent-6">Continue</span> Studying
              </p>
              <button className="border border-accent-6 text-accent-6 text-xs xl:text-sm  hover:text-primary-1 hover:bg-accent-6 px-2 xl:px-3 xl:py-1 xl:mb-1 mb-2 rounded-full">
                All Courses
              </button>
            </div>
            {/* Continue studying contents */}
            <div className="w-[90%] mx-auto h-full  flex flex-col shadow-2xl   border border-accent-6 mt-6 rounded-lg p-4  space-y-4 cursor-pointer">
              <div className="h-48  lg:h-52  xl:h-64 ">
                <Skeleton className="w-full h-full object-cover rounded-lg bg-gray-200 animate-pulse" />
              </div>
              <div className="space-y-2 lg:space-y-3 h-full">
                <div className="flex flex-row w-[100%] justify-between items-center">
                  <Skeleton className=" h-2  w-[40%] bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-2  flex-grow bg-gray-200 rounded animate-pulse" />
                  <Skeleton className="h-2 flex-grow bg-gray-200 rounded animate-pulse" />
                  <Skeleton className="h-2 flex-grow bg-gray-200 rounded animate-pulse" />
                  <Skeleton className="h-2 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* sabbath school and devotionals */}
        <div className="grid grid-cols-1 space-y-6  items-start justify-start w-full gap-2 lg:space-y-12  lg:w-[85%] xl:w-[90%] mx-auto ">
          {/* sabbath school container */}
          <div className="w-[90%] mx-auto ">
            {/* Study this week's SSL */}
            <div className="flex flex-row justify-between items-center border-b border-accent-6 pb-1">
              <p className=" text-secondary-6 text-lg lg:text-xl xl:text-3xl">
                <span className="text-accent-6">Study</span> this week's SSL
              </p>
              <button className="mb-1 border border-accent-6 hover:bg-accent-6 hover:text-primary-1  px-2 rounded-full text-accent-6 text-xs xl:px-3 xl:py-1 xl:mb-1 xl:text-sm">
                All SSLs
              </button>
            </div>
            <div className="flex flex-row shadow-2xl border border-accent-6 mt-6 rounded-lg p-4 gap-4 lg:gap-6   w-[90%] mx-auto cursor-pointer">
              <div className="h-auto w-32 md:w-[40%] lg:w-[80%] lg:h-52  xl:h-64 ">
                <Skeleton className="w-full h-full object-cover rounded-lg  bg-gray-200 animate-pulse" />
              </div>
              <div className="w-[65%] space-y-1 md:space-y-3 flex flex-col justify-center items-center ">
                <Skeleton className="h-2  w-[60%] bg-gray-200 rounded animate-pulse" />
                <Skeleton className="h-2 w-[60%] bg-gray-200 rounded animate-pulse" />
                <div className="border-b border-accent-6 lg:w-[70%] lg:mx-auto" />
                <Skeleton className="h-2 w-[60%] bg-gray-200 rounded animate-pulse" />
                <Skeleton className="h-2 w-[60%] bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Discover Devotionals Container */}
          <div className="w-[90%] mx-auto ">
            {/* Discover Devotionals */}
            <div className="flex flex-row justify-between items-start border-b border-accent-6 xl:items-center xl:mt-1">
              <h2 className=" text-secondary-6 text-lg lg:text-xl xl:text-3xl">
                <span className="text-accent-6"> Discover</span> Devotionals
              </h2>
              <button className="mb-2 ">
                <span className="border border-accent-6 hover:bg-accent-6 hover:text-primary-1 px-2 rounded-full text-accent-6 text-xs xl:px-3 xl:py-1 xl:mb-1 xl:text-sm">
                  All Devotionals
                </span>
              </button>
            </div>
            <div className="grid grid-cols-2 justify-between mt-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-auto w-[90%]">
              {"abcd".split("").map((i) => (
                <Skeleton
                  key={i}
                  className="w-full h-48  lg:h-52  xl:h-64   object-contain rounded-lg bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
