import { fetchLatestGeneratedImages } from "@/actions/global";
import { getUserFirstProject } from "@/actions/user/user";
import HeaderMinimal from "@/components/layout/HeaderMinimal";
import ExploreLiveFeed from "@/components/view/explore/live/ExploreLiveFeed";
import ExploreNavbar from "@/modules/explore/layouts/Navbar";
import { ExploreHeader } from "@/modules/explore/views/ExploreHeader";
import React from "react";

const ExploreLiveFeedPage = async () => {
  const liveFeed = await fetchLatestGeneratedImages({
    limit: 20,
    offset: 0,
  });
  const subProject = await getUserFirstProject();

  return (
    <div className="bg-gradient-to-br from-[rgba(244,184,255,0.2)] to-[rgba(46,157,254,0.2)]">
      <ExploreNavbar className="sticky top-0 z-10 py-6" />

      {/* <ExploreHeader withoutSearch /> */}
      <div className="px-8 sm:px-18 md:px-24 p-0 mx-auto">
        <ExploreLiveFeed data={liveFeed} subProject={subProject} />
      </div>
    </div>
  );
};

export default ExploreLiveFeedPage;
