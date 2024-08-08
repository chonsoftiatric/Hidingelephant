import Button from "@/components/common/button/Button";
import TextLogo from "@/components/common/elements/TextLogo";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="flex justify-center items-center">
          <TextLogo />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Page Not Found!
        </h1>
        <p className="mt-4">
          {`Oops, it looks like the page you're looking for has gone into hiding.
          Don't worry, we'll help you find your way back.`}
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button>Take me home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
