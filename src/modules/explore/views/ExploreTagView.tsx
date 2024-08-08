"use client";

import ExploreNavbar from "@/modules/explore/layouts/Navbar";
import { ExploreFilter } from "@/modules/explore/components/ExploreFilter";
import { ExploreHeader } from "@/modules/explore/views/ExploreHeader";
import { ExploreImageGrid } from "@/modules/explore/views/ExploreImageGrid";
import { ExploreTags } from "@/modules/explore/components/ExploreTags";
import { GetFeedDataResponse } from "@/actions/feed/feed";

type ExploreTagViewProps = {
  data: GetFeedDataResponse;
  tag: string;
};
const ExploreTagView = ({ data, tag }: ExploreTagViewProps) => {
  const feed = data?.feed;
  return (
    <div>
      <ExploreNavbar />
      <ExploreHeader />
      <div className="sm:px-18 flex w-full justify-between px-8 py-4 md:px-24 gap-4">
        <ExploreTags tag={tag} />
        <ExploreFilter />
      </div>

      {feed?.length ? (
        <ExploreImageGrid feed={feed} />
      ) : (
        <div className="mx-auto mt-8">
          <p className="text-center">No Images Shared to the community</p>
        </div>
      )}
    </div>
  );
};

export default ExploreTagView;
