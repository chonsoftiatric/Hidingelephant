import { getSharedSubProject } from "@/actions/sub-project";
import SubProjectLiveFeed from "@/components/view/SharedSubProject/SubProjectLiveFeed";
import ExploreNavbar from "@/modules/explore/layouts/Navbar";
import dynamic from "next/dynamic";

import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: {
    id: string;
    hash: string;
  };
};
const SharedProjetPage = async ({ params }: Props) => {
  const { subProject, prompts } = await getSharedSubProject({
    hash: params.hash,
    subProjectId: Number(params.id),
  }).catch(() => notFound());
  return (
    <>
      <div className="bg-gradient-to-br from-[rgba(244,184,255,0.2)] to-[rgba(46,157,254,0.2)]">
        <ExploreNavbar className="sticky top-0 z-10 py-6" />

        {/* <ExploreHeader withoutSearch /> */}
        <div className="px-8 sm:px-18 md:px-24 p-0 mx-auto">
          <SubProjectLiveFeed data={prompts} subProject={subProject} />
        </div>
      </div>
    </>
  );
};

export default SharedProjetPage;
