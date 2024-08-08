"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import Button from "@/components/common/button/Button";
import { cn } from "@/lib/utils";

type INavbar = {
  className?: string;
};
const Navbar = ({ className }: INavbar) => {
  return (
    <nav className={cn("flex items-center gap-8 w-full", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="outline-none">
          <Link className="flex gap-2 items-center" href="#">
            <span>Designer</span>
            <ChevronDownIcon />
          </Link>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36">
          <DropdownMenuItem className="cursor-pointer">
            <Link href="/dashbaord">
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* @temp hidden */}
      {/* <Link href="/pricing">Pricing</Link> */}
      <Button className="ml-8 w-32">Login</Button>
    </nav>
  );
};

export default Navbar;
