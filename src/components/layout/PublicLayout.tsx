import React from "react";
import HeaderMinimal from "./HeaderMinimal";
import FooterMinimal from "./FooterMinimal";
import { cn } from "@/lib/utils";

type IPublicLayout = {
  children: React.ReactNode;
  className?: string;
};
const PublicLayout = ({ children, className }: IPublicLayout) => {
  return (
    <div className={cn("overflow-x-hidden", className)}>
      <HeaderMinimal />
      <div className="min-h-[calc(100vh-56px)]">{children}</div>
      <FooterMinimal />
    </div>
  );
};

export default PublicLayout;
