import Image from "next/image";
import React from "react";

const HidingStartHere = () => {
  return (
    <div className="h-[calc(100vh-56px)] flex justify-center items-center gap-4 md:gap-6">
      <Image
        src="/images/grayscale-logo.png"
        alt="logo"
        width={125}
        height={125}
      />
      <div className="max-w-[40ch]">
        <p className=" text-light-gray text-sm">HidingElephant</p>
        <h5 className=" text-medium-gray text-sm font-semibold">
          Your design starts here
        </h5>
      </div>
    </div>
  );
};

export default HidingStartHere;
