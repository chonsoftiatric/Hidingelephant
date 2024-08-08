import { Skeleton } from "@/components/ui/skeleton";

export const ExploreImageGridSkelton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 px-8 sm:px-18 md:px-24 py-4">
      <Skeleton className="bg-gray-200 aspect-square min-h-[300px] rounded-xl" />
    </div>
  );
};
