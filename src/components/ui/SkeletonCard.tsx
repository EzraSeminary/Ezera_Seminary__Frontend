import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className=" w-[90%] mx-auto flex flex-col h-full border border-accent-6 mt-6 rounded-lg bg-primary-2 shadow-2xl p-4  space-y-4 cursor-pointer">
      <div className="h-48  lg:h-52  xl:h-64">
        <Skeleton className="w-full  h-full object-cover rounded-lg bg-gray-200" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 flex-grow bg-gray-200" />
        <Skeleton className="h-4 flex-grow bg-gray-200" />
      </div>
    </div>
  );
}
