import DocsIcon from "@/components/icons/DocsIcon";
import LogoutIcon from "@/components/icons/LogoutIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";
import { ComponentIcon, RssIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

type UserProfileMenuProps = {
  username: string | undefined;
};
const UserProfileMenu = ({ username }: UserProfileMenuProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Link
        className="flex items-center gap-4 group"
        href={`/designer/${username}`}
      >
        <ProfileIcon />
        <span className="group-hover:text-primary-default">Profile</span>
      </Link>
      <Link className="flex items-center gap-4 group" href={`/dashboard`}>
        <ComponentIcon />
        <span className="group-hover:text-primary-default">Dashboard</span>
      </Link>
      <Link
        href={`https://blog.hidingelephant.com`}
        target="_blank"
        className="flex items-center gap-4 group"
      >
        <RssIcon className="hover:stroke-primary-default" />
        <span className="group-hover:text-primary-default">Blog</span>
      </Link>
      <Link href={"https://docs.hidingelephant.com"} target="_blank">
        <button className="flex items-center gap-4 group">
          <DocsIcon />
          <span className="group-hover:text-primary-default">Docs</span>
        </button>
      </Link>
      <button
        onClick={() =>
          signOut({
            callbackUrl: "/p/playground",
          })
        }
        className="flex items-center gap-4"
      >
        <LogoutIcon className="stroke-red-500" />
        <span className="text-red-500">Logout</span>
      </button>
    </div>
  );
};

export default UserProfileMenu;
