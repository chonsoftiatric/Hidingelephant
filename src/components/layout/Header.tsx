import React from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Navbar from "./Navbar";

type IHeader = {
  className?: string;
};

const Header = ({ className }: IHeader) => {
  return (
    <header className={cn("flex justify-between p-2 container", className)}>
      <Image
        src="/images/logo.png"
        height={40}
        width={40}
        alt="hiding elephant logo"
      />
      <div>
        <Navbar className="hidden sm:flex" />
        <Sheet>
          <SheetTrigger asChild className="sm:hidden">
            <HamburgerMenuIcon className="cursor-pointer" />
          </SheetTrigger>
          <SheetContent>
            <Navbar className="flex-col items-start mt-4" />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
