import { redirect } from "next/navigation";
import React from "react";

const ExplorePage = () => {
  if (2 > 1) {
    redirect("/explore/tag/all");
  }
  return <div>ExplorePage</div>;
};

export default ExplorePage;
