import { Skeleton } from "@/components/ui/skeleton";

const ContentsSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className=" flex flex-col items-center justify-center space-y-4 ">
        {/* Title of the page */}

        <h1 className="text-3xl font-nokia-bold text-secondary-6 text-center">
          Our Contents
        </h1>
        <hr className="border-accent-5 border-1 w-[90%] pb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-pointer w-[80%] mx-auto">
          {"abc".split(" ").map((i) => (
            <Skeleton
              key={i}
              className="w-[90%] border border-accent-6 mt-6 rounded h-56 bg-gray-200 shadow-2xl p-4  space-y-4 "
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentsSkeleton;
