"use client";
import React from "react";
import { UserIdentity } from "@/common/components/UserIdentity";
import Button from "@/components/common/button/Button";
import { ExploreSidebar } from "./Sidebar";
import { useUserDetails } from "@/services/user.service";
import Link from "next/link";
import TextLogo from "@/components/common/elements/TextLogo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LocalIcon from "@/components/icons/LocalIcon";
import UserProfileMenu from "@/components/common/elements/UserProfileMenu";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";

type Props = {
  className?: string;
};
const ExploreNavbar = ({ className }: Props) => {
  const { data: user } = useUserDetails();
  const [goBack, setGoBack] = React.useState("");

  React.useEffect(() => {
    const goBackUrl = localStorage.getItem("go-back");
    if (goBackUrl) {
      setGoBack(goBackUrl);
    }
  }, []);
  return (
    <div
      className={cn(
        "px-8 sm:px-18 md:px-24 h-16 flex justify-between items-center",
        className
      )}
    >
      <TextLogo />
      <ExploreSidebar />
      <div className="md:flex gap-4 md:gap-8 items-center text-sm md:text-base hidden">
        {goBack ? (
          <Button>
            <Link className="flex gap-2 items-center" href={goBack}>
              <ArrowLeftIcon size={20} /> Back To App
            </Link>
          </Button>
        ) : null}
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/explore/tag/all">Explore</Link>
        <Link href="/explore/live">Live Feed</Link>
        <Link target="_blank" href="http://blog.hidingelephant.com">
          Blog
        </Link>
        {/* @temp hidden */}
        {/* <Link href="/pricing">Pricing</Link> */}
        {user ? (
          <div className="flex gap-4">
            <UserIdentity />
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-2 pr-4">
                  <LocalIcon icon="dots-horizontal" />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <UserProfileMenu username={user.username || undefined} />
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Link href="/login">
            <Button size={"sm"} className="px-8">
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ExploreNavbar;
