import { cn } from "@/lib/utils";
import * as React from "react";
type ISVGIcon = { className?: string } & React.ComponentProps<"svg">;
const PlanIcon = (props: ISVGIcon) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={cn("group", props.className)}
  >
    <path
      className="group-hover:stroke-primary-default"
      d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V4C20 4 19 5 16 5C13 5 11 3 8 3C5 3 4 4 4 4M4 22L4 2"
      stroke="#0D0C0C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default PlanIcon;
