import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type IContentSection = {
  className?: string;
  textClassName?: string;
  imageClassName?: string;
  title: string;
  subTitle?: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  children?: React.ReactNode;
  alignment?: "content-image" | "image-content";
};

const ContentSection = ({
  className,
  imageClassName,
  textClassName,
  title,
  subTitle,
  imageSrc,
  imageAlt,
  children,
  alignment = "content-image",
}: IContentSection) => {
  const isImageContent = alignment === "image-content";
  return (
    <section className={cn("mt-32", className)}>
      <div className="flex flex-col sm:flex-row gap-y-10 gap-4 justify-center items-center">
        {/* Text Content */}
        <div
          className={cn(
            "flex-1 order-2 sm:order-1",
            textClassName,
            isImageContent ? "sm:order-2" : ""
          )}
        >
          <h3 className="section-title text-center sm:text-left">{title}</h3>
          {typeof subTitle === "string" ? (
            <p className="text-gray-800 font-medium mt-4 text-center sm:text-left">
              {subTitle}
            </p>
          ) : subTitle ? (
            <div className="mt-3">{subTitle}</div>
          ) : null}
          {children}
        </div>
        {/* Image */}
        <div
          className={cn(
            "flex-1 order-1 sm:order-2 flex justify-end items-center",
            imageClassName,
            isImageContent ? "sm:order-1" : ""
          )}
        >
          <Image
            src={imageSrc}
            height={600}
            width={500}
            alt={imageAlt}
            // className="max-w-[500px]"
          />
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
