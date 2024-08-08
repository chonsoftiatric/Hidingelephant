import { cn } from "@/lib/utils";
import React from "react";

type IHero = {
  title: React.ReactNode;
  subTitle?: string;
  children: React.ReactNode;
  className?: string;
};
const Hero = ({ title, subTitle, children, className }: IHero) => {
  return (
    <section
      className={cn(
        "mt-16 lg:mt-32 md:px-10 flex flex-col items-center ",
        className
      )}
    >
      <h1 className="title max-w-[22ch] text-center">{title}</h1>
      {subTitle ? (
        <p className="text-gray-800 mt-1 text-center">{subTitle}</p>
      ) : null}
      {children}
    </section>
  );
};

export default Hero;
