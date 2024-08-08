import { getFeedData } from "@/actions/feed/feed";
import ExploreView from "@/modules/explore/views/ExploreTagView";
import { notFound } from "next/navigation";
import React from "react";

type ExploreTagPage = {
  params: {
    tag: string;
  };
  searchParams: {
    sortBy: string | undefined;
  };
};
const ExploreTagPage = async ({
  params: { tag },
  searchParams: { sortBy },
}: ExploreTagPage) => {
  const data = await getFeedData({ tag, offset: 0, sortBy });
  if (!data) {
    notFound();
  }
  return <ExploreView tag={tag} data={data} />;
};

export default ExploreTagPage;
