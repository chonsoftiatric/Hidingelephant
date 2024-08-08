import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type ITextLogo = {
  className?: string;
  isDark?: boolean;
  href?: string;
};
const TextLogo = ({
  className,
  isDark = false,
  href = "/p/playground",
}: ITextLogo) => {
  return (
    <Link href={href}>
      <div className="flex gap-2 items-center">
        <Image
          src={"/icons/app-logo-transparent.svg"}
          height={40}
          width={40}
          alt="elephant logo"
          className="mx-auto rounded-lg"
        />
        <span
          className={cn(
            "font-bold text-[20px]",
            className,
            isDark ? "text-white" : ""
          )}
        >
          Hiding Elephant
        </span>
      </div>
    </Link>
  );
};

export default TextLogo;
