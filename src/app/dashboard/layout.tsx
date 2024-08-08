"use client";

import React from "react";
import ExpandedMenu from "@/components/layout/Menu";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <ExpandedMenu>{children}</ExpandedMenu>;
};

export default Layout;
