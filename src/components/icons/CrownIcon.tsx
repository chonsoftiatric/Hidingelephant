import React from "react";

type ISVGIcon = { className?: string } & React.ComponentProps<"svg">;
const CrownIcon = (props: ISVGIcon) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    className={props.className}
  >
    <g clipPath="url(#a)">
      <path
        className={props.className}
        stroke="#0D0C0C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M23.643 6.857 18.5 12l-6-8.571L6.5 12 1.357 6.857V18a2.571 2.571 0 0 0 2.572 2.571h17.143A2.572 2.572 0 0 0 23.643 18V6.857Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M.5 0h24v24H.5z" />
      </clipPath>
    </defs>
  </svg>
);
export default CrownIcon;
