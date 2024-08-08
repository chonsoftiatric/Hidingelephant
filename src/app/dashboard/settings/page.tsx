import Settings from "@/components/view/Pages/Settings";
import { notFound } from "next/navigation";
import React from "react";

const SettingPage = () => {
  // @temp - hide the page
  if (2 > 1) {
    return notFound();
  }
  return <Settings />;
};

export default SettingPage;
