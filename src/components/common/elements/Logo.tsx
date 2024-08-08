import Image from "next/image";
import Link from "next/link";
import React from "react";

type LogoProps = {
  isCollapsed?: boolean;
};
const Logo = ({ isCollapsed }: LogoProps) => {
  return (
    <Link
      href="/p/playground"
      className={`sticky top-0 left-0 p-3 flex items-center gap-3 ${
        isCollapsed ? "justify-center" : null
      }`}
    >
      <Image
        alt="hiding elephant"
        src={"/icons/app-logo-transparent.svg"}
        height={30}
        width={30}
        className="rounded-xl"
      />
      {!isCollapsed && (
        <h1 className="font-semibold text-lg text-center">Hiding Elephant</h1>
      )}
    </Link>
  );
};

export default Logo;
