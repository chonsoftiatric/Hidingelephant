"use client";
import ExploreNavbar from "@/modules/explore/layouts/Navbar";
import { FeedImageDetails } from "@/modules/explore/views/FeedImageDetails";
import { useParams } from "next/navigation";

const ImageDetailsPage = () => {
  const params = useParams();
  const feedId = params.id as string;

  return (
    <div>
      <ExploreNavbar />
      <div className="sm:px-10 md:px-16 h-[calc(100vh-4rem)] flex items-center justify-center">
        <FeedImageDetails feedId={feedId} />
      </div>
    </div>
  );
};

export default ImageDetailsPage;
