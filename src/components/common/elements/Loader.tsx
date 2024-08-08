import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

type ILoader = {
  className?: string;
};
const Loader = ({ className }: ILoader) => {
  return <Loader2 className={cn("animate animate-spin", className)} />;
};

export default Loader;
