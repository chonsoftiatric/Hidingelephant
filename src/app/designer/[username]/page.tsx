"use client";

import { IFeedData } from "@/actions/feed/feed";
import { useGetDesigner } from "@/modules/explore/hooks/designer.hooks";
import { useGetFeed } from "@/modules/explore/hooks/feed.hooks";
import ExploreNavbar from "@/modules/explore/layouts/Navbar";
import { DesignerProfileHeader } from "@/modules/explore/views/DesignerProfileHeader";
import { ExploreImageGrid } from "@/modules/explore/views/ExploreImageGrid";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const DesignerPage = () => {
  const params = useParams();
  const username = params.username as string;

  const { data: feedData } = useGetFeed({ username });
  const { data: designerData } = useGetDesigner({
    username: username,
  });

  const feed = useMemo(
    () => feedData?.pages.flatMap((page) => page?.feed) || [],
    [feedData]
  ) as unknown as IFeedData;

  return (
    <div>
      <ExploreNavbar />
      <DesignerProfileHeader
        username={username}
        firstName={designerData?.firstName || ""}
        lastName={designerData?.lastName || ""}
        avatar={designerData?.avatar || undefined}
        imagesGenerated={designerData?.imagesGenerated || 0}
        totalLikes={designerData?.totalLikes || 0}
        coverImage={designerData?.cover || undefined}
        id={designerData?.id || undefined}
        linkedinUrl={designerData?.linkedinUrl || undefined}
        facebookUrl={designerData?.facebookUrl || undefined}
        twitterUrl={designerData?.twitterUrl || undefined}
      />
      <ExploreImageGrid feed={feed} />
    </div>
  );
};

export default DesignerPage;
