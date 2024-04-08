import { Skeleton } from "@/components/ui/skeleton";

const IntroSkeleton = () => {
  return (
    <div className="pt-[10rem] mt-[80vh] md:mt-[96vh] md:pt-[5rem]  lg:mt-[96vh] lg:pt-[5.5rem] xl:mt-[96vh] xl:pt-[5.2rem] mb-16 w-[80%] mx-auto md:flex  md:items-center  md:justify-start">
      <Skeleton className="mt-12 w-full h-48  lg:h-72 md:mt-0 md:w-1/2  rounded-3xl  bg-gray-200" />
    </div>
  );
};

export default IntroSkeleton;
