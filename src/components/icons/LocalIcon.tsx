import Image from "next/image";
import React from "react";

type Icon =
  | "magic-wand"
  | "crown"
  | "magic-stars"
  | "arrow-right"
  | "dots-horizontal";
const icons: Record<Icon, string> = {
  "magic-wand": "/icons/magic-wand.svg",
  crown: "/icons/crown.svg",
  "magic-stars": "/icons/magic-stars.svg",
  "arrow-right": "/icons/arrow-right.svg",
  "dots-horizontal": "/icons/dots-horizontal.svg",
};
type ILocalIcon = {
  height?: number;
  width?: number;
  className?: string;
  icon: Icon;
};
const LocalIcon = ({
  height = 20,
  width = 20,
  className = "",
  icon,
}: ILocalIcon) => {
  return (
    <Image
      priority
      quality={100}
      height={height || 20}
      width={width || 20}
      src={icons[icon]}
      alt={`${icon} icon`}
      className={className}
    />
  );
};

export default LocalIcon;
