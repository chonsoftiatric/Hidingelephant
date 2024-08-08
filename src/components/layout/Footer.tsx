import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="p-8 pb-4 lg:p-14 lg:pb-6 bg-primary-default text-gray-200">
      <div className="flex gap-8 flex-wrap">
        <div className="w-[40%] pr-6 min-w-[300px]">
          <Image src="/icons/white-logo.svg" height={40} width={40} alt="" />
          <h5 className="font-semibold text-white text-lg mt-1">
            Hiding Elephant
          </h5>
          <p className="opacity-80 mt-2">
            {`Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s`}
          </p>
        </div>
        <div className="flex-1">
          <h6 className="font-semibold text-white">Source</h6>
          <div className="flex flex-col gap-3 mt-6">
            <Link className="opacity-80" href="/about">
              About
            </Link>
            <Link className="opacity-80" href="/help">
              Help
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <h6 className="font-semibold text-white">Company</h6>
          <div className="flex flex-col gap-3 mt-6">
            <Link className="opacity-80" href="/blog">
              Blog
            </Link>
            <Link className="opacity-80" href="/pricing">
              Pricing
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex gap-2">
            <div className="rounded-full p-2 bg-white">
              <FacebookIcon className="stroke-primary-default" />
            </div>
            <div className="rounded-full p-2 bg-white">
              <TwitterIcon className="stroke-primary-default" />
            </div>
            <div className="rounded-full p-2 bg-white">
              <InstagramIcon className="stroke-primary-default" />
            </div>
            <div className="rounded-full p-2 bg-white">
              <LinkedinIcon className="stroke-primary-default" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 border-t-gray-300 border-t-[1px] pt-2">
        <p className="text-gray-200">
          Copyrights 2023 Hiding Elephant. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
