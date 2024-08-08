"use client";

import React, { useMemo, useState } from "react";
import TextLogo from "@/components/common/elements/TextLogo";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewProject from "@/components/common/elements/NewProject";
import ProjectNavList from "@/components/common/elements/ProjectNavList";
import LocalIcon from "@/components/icons/LocalIcon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useParams, usePathname } from "next/navigation";
import { useUserDetails } from "@/services/user.service";
import LeftSidePannelCredits from "@/modules/project/elements/LeftSidePannelCredits";
import Image from "next/image";
import { RiHome6Line } from "react-icons/ri";
import { MdOutlineExplore } from "react-icons/md";
import { motion } from "framer-motion";
import { EyeIcon } from "lucide-react";
import UserProfileMenu from "@/components/common/elements/UserProfileMenu";
import { useMyProjects } from "@/services/project.service";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ILeftSidebarContent = {
  className?: string;
  open?: boolean;
};
type ILinkItem = {
  icon: React.ReactNode;
  path: string;
  label: string;
  isActive: boolean;
  isClosed?: boolean;
};

const LinkItem = ({ icon, label, isActive, path, isClosed }: ILinkItem) => {
  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
      <Link
        href={path}
        className={`flex gap-4 items-center text-gray-500 p-3 rounded-2xl hover:text-primary-default hover:bg-[#CCE1FF] font-medium group ${
          isActive ? "bg-[#CCE1FF] text-primary-default" : null
        } ${isClosed ? "w-max" : null}`}
      >
        {icon}
        {!isClosed && <span>{label}</span>}
      </Link>
    </motion.div>
  );
};

const LeftSidebarContent = ({ className, open }: ILeftSidebarContent) => {
  const { data } = useMyProjects();
  const projects = data || [];
  const project = data ? data[0] : null;
  const pathname = usePathname();
  const isActive = (path: string) => {
    return pathname === path;
  };
  const sidebarLinks: ILinkItem[] = useMemo(() => {
    return [
      {
        icon: <RiHome6Line size={24} />,
        path: "/dashboard",
        label: "Dashboard",
        isActive: isActive("/dashboard"),
      },
      {
        icon: <MdOutlineExplore size={24} />,
        path: "/explore/tag/all",
        label: "Explore",
        isActive: isActive("/explore/tag/all"),
      },
      // @temp hidden
      // {
      //   icon: <AiOutlineUserAdd size={24} />,
      //   path: "/dashboard/referrals",
      //   label: "Referrals",
      //   isActive: isActive("/dashboard/referrals"),
      // },
    ];
  }, [pathname]);

  const isClosed = open === false;
  const { data: user } = useUserDetails();
  const params = useParams();
  const id = params.id as string;
  const getInitials = (): string => {
    if (!user?.firstName) return "";
    const name = user.firstName + user.lastName;
    const name_arr = name.split(" ");
    if (name_arr.length > 1) {
      return `${name_arr[0].charAt(0)}${name_arr[1].charAt(0)}`;
    }
    return `${name_arr[0][0]}${name_arr[0][1]}`;
  };
  const initials = getInitials();
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const tooglePopover = () => {
    setOpenPopover((state) => !state);
  };

  return (
    <div
      className={cn(
        "flex-1  flex flex-col max-w-[235px] h-[100vh] p-4 overflow-auto leftSideBar",
        className,
        {
          "pl-2": isClosed,
        },
        !isClosed ? "xl:min-w-[235px]" : "p-1 overflow-hidden"
      )}
    >
      <div
        className={cn({
          "mt-4": isClosed,
        })}
      >
        {!isClosed ? (
          <TextLogo />
        ) : (
          <Link href="/p/playground">
            <Image
              src={"/icons/app-logo-transparent.svg"}
              height={45}
              width={45}
              alt="elephant logo"
              className="mx-auto rounded-lg"
            />
          </Link>
        )}
        <NewProject className="mt-6" iconOnly={isClosed} />
      </div>
      <aside className="flex flex-1 flex-col mt-5">
        {!isClosed && (
          <>
            {project ? (
              <div
                className={cn(
                  "w-full rounded-xl cursor-pointer bg-white card text-primary-default mb-6 border hover:bg-primary-default hover:text-white",
                  {
                    "bg-primary-default text-white": "playground" === id,
                  }
                )}
              >
                <Link
                  href={`/p/playground`}
                  className="flex gap-3 py-3 items-center pl-2"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button>
                        <EyeIcon className="inline-block" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Generations in the Playground project are visible in our{" "}
                      <Link
                        className="underline text-primary-default"
                        href="/explore/live"
                        target="_blank"
                      >
                        Live Feed
                      </Link>
                    </TooltipContent>
                  </Tooltip>

                  {project.name.length > 14
                    ? project.name.slice(0, 12) + "..."
                    : project.name}
                </Link>
              </div>
            ) : null}
            <ScrollArea className="max-h-[220px]">
              <ProjectNavList
                id={id}
                data={projects.filter((p) => p.id !== project?.id)}
              />
            </ScrollArea>
          </>
        )}
        <div
          className={`mt-auto pt-4  ${
            isClosed ? "flex flex-col items-center" : null
          } `}
        >
          {!isClosed && <LeftSidePannelCredits isClosed={isClosed} />}
          {/* @temp hidden */}
          {/* <UpgradeCard iconOnly={isClosed} /> */}
          <div
            className={`flex flex-col gap-1 mt-3 ${
              isClosed ? "items-center" : null
            }`}
          >
            {sidebarLinks.map((item) => (
              <LinkItem key={item.path} {...item} isClosed={isClosed} />
            ))}
            <div className="flex gap-3 items-center justify-between text-gray-500">
              <div
                className={`flex items-center gap-3 cursor-pointer pl-3 py-3 ${
                  isClosed ? "pl-8" : null
                }`}
                onClick={tooglePopover}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.profileImage || undefined}
                    alt={user?.username || user?.firstName}
                  />
                  <AvatarFallback className="text-sm uppercase">
                    {user?.profileImage ? (
                      <Image
                        src={user?.profileImage}
                        alt={user?.username || user?.firstName}
                        height={40}
                        width={40}
                        className="rounded-full"
                      />
                    ) : (
                      initials
                    )}
                  </AvatarFallback>
                </Avatar>

                {!isClosed && (
                  <span className="text-[12px] font-semibold text-black w-full">
                    {user?.firstName &&
                    (user.firstName + user.lastName).length > 10
                      ? `${user.firstName?.slice(0, 10)}...`
                      : ""}
                  </span>
                )}
              </div>
              <Popover open={openPopover} onOpenChange={tooglePopover}>
                <PopoverTrigger asChild>
                  <button className="p-2 pr-4">
                    <LocalIcon icon="dots-horizontal" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="rounded-xl p-3 pr-10">
                  <UserProfileMenu username={user?.username || undefined} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default LeftSidebarContent;
