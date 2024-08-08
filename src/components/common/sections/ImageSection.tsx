import Image from "next/image";
import React from "react";
import BlurEffect from "@/components/common/elements/BlurEffect";

type ImageSectionType = {
  image: string;
  alt: string;
};
const ImageSection = ({ image }: ImageSectionType) => {
  return (
    <section className="flex justify-center items-center relative isolate mt-10 md:mt-14">
      <Image
        src={image}
        width={1400}
        height={1400}
        quality={100}
        className="w-full sm:w-[90%]"
        alt="hiding elephant ai logo maker"
      />
      <BlurEffect />
      <BlurEffect type="right" />
    </section>
  );
};

export default ImageSection;
