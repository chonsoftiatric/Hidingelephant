import { TwitterIcon } from "lucide-react";
import React from "react";
import TextLogo from "../common/elements/TextLogo";
import Link from "next/link";

const FooterMinimal = () => {
  return (
    <footer className="p-8 pb-4 lg:p-14 lg:pb-6 bg-primary-default text-gray-200">
      <div className="flex gap-3 flex-wrap justify-center flex-col items-center">
        <TextLogo isDark />

        <p className="opacity-80 max-w-[65ch] text-center">
          {`Created by designers for designers, our tool makes logo designing quick, fun, and incredibly creative. Dive in, and let's make something amazing together!`}
        </p>
        <div className="mb-4 flex justify-center items-center gap-6">
          <Link
            target="_blank"
            className="text-white hover:underline"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
          <Link
            target="_blank"
            className="text-white hover:underline"
            href="/terms-of-service"
          >
            Terms of Service
          </Link>
          <Link
            target="_blank"
            className="text-white hover:underline"
            href="/cookie-policy"
          >
            Cookie Policy
          </Link>
        </div>
        <Link
          href="https://twitter.com/HidingElephant"
          target="_blank"
          className="rounded-full p-2 bg-white cursor-pointer hover:-translate-y-1 ease-in-out duration-150"
        >
          <TwitterIcon className="stroke-primary-default" />
        </Link>
      </div>

      <div className="mt-6 border-t-gray-300 border-t-[1px] pt-2">
        <p className="text-gray-200 text-center">
          Copyrights 2023 Hiding Elephant. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default FooterMinimal;
