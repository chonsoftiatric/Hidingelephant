import { cn } from "@/lib/utils";
import * as React from "react";
type ISVGIcon = { className?: string } & React.ComponentProps<"svg">;
const ExploreIcon = (props: ISVGIcon) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="group-hover:stroke-primary-default"
      d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
      stroke="#7C7C7C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className="group-hover:stroke-primary-default"
      d="M13.7221 7.26596C14.2107 7.10312 14.4549 7.02169 14.6174 7.07962C14.7587 7.13003 14.87 7.24127 14.9204 7.38263C14.9783 7.54507 14.8969 7.78935 14.734 8.27789L13.2465 12.7405C13.2001 12.8797 13.1769 12.9492 13.1374 13.007C13.1024 13.0582 13.0582 13.1024 13.007 13.1374C12.9492 13.1769 12.8797 13.2001 12.7405 13.2465L8.27789 14.734C7.78935 14.8969 7.54507 14.9783 7.38263 14.9204C7.24127 14.87 7.13003 14.7587 7.07962 14.6174C7.02169 14.4549 7.10312 14.2107 7.26596 13.7221L8.75351 9.25947C8.79989 9.12033 8.82308 9.05076 8.8626 8.99299C8.8976 8.94182 8.94182 8.8976 8.99299 8.8626C9.05076 8.82308 9.12033 8.79989 9.25947 8.75351L13.7221 7.26596Z"
      stroke="#7C7C7C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default ExploreIcon;
