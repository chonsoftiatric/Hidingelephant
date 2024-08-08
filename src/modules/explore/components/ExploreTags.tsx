"use client";

import Link from "next/link";
import { useGetTopTags } from "../hooks/tag.hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ExploreTagsProps = {
  tag: string;
};
export const ExploreTags = ({ tag }: ExploreTagsProps) => {
  const { data: topTags, isLoading } = useGetTopTags();
  return (
    <ScrollArea className="flex-1 pb-2">
      <div className="flex gap-4 pb-2">
        <Link
          href={`/explore/tag/all`}
          className={`flex cursor-pointer items-center justify-center rounded-3xl px-4 py-1 font-semibold transition-colors duration-300 ${
            tag === "all"
              ? "bg-blue-50 text-blue-500"
              : "bg-[#f6f7f7] text-gray-500"
          }`}
        >
          <p>all</p>
        </Link>
        {isLoading &&
          [...Array(4).keys()].map((key) => {
            return (
              <Skeleton
                key={key}
                className="h-[40px] w-16 bg-gray-200 rounded-3xl"
              />
            );
          })}
        {topTags &&
          topTags.map((topTag, index) => {
            return (
              <Link
                key={index}
                href={`/explore/tag/${topTag.tag}`}
                className={`flex min-w-fit cursor-pointer items-center justify-center rounded-3xl px-4 font-semibold transition-colors duration-300 ${
                  tag === `${topTag.tag.toLowerCase()}`
                    ? "bg-blue-50 text-blue-500"
                    : "bg-[#f6f7f7] text-gray-500"
                }`}
              >
                {topTag.tag.trim().toLowerCase()}
              </Link>
            );
          })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
