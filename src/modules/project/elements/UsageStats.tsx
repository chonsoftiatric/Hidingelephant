import { cn } from "@/lib/utils";
import { useGetUserStats } from "@/services/user.service";
import React from "react";





type IUsageStats = {
  className?: string;
};
const UsageStats = ({ className }: IUsageStats) => {
  const { data: userStats } = useGetUserStats()
  const UsageCards = [
    {
      description: "images generated by the community",
      value: userStats?.totalImageGenerated[0].count || 0,
    },
    {
      description: "images generated by you",
      value: userStats?.imagesGeneratedByUser[0].count || 0,
    },
    {
      description: "likes on your shared content",
      value: userStats?.likesOnUserContent[0].sum,
    },
  ];
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {UsageCards.map((item, index) => (
        <div className="p-5 py-8 rounded-2xl border-[1px] border-light-gray" key={`${index}-usage-cards`}>
          <div className="text-3xl md:text-5xl font-bold text-primary-default">
            {item.value}
          </div>
          <div className="mt-2 font-medium">{ item.description }</div>
        </div>
      ))}
    </div>
  );
};

export default UsageStats;