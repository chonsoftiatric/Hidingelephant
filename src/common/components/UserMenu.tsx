import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import LocalIcon from "../../components/icons/LocalIcon";
import {
  ArrowRightFromLineIcon,
  CircleUserIcon,
  CogIcon,
  FlagIcon,
  NewspaperIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useUserDetails } from "@/services/user.service";
import Link from "next/link";

export const UserMenu = () => {
  const { data: user } = useUserDetails();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 pr-4">
          <LocalIcon icon="dots-horizontal" />
        </button>
      </PopoverTrigger>
      {/* @TODO: refactor this to new element */}
      <PopoverContent className="rounded-xl p-3 pr-10 bg-white shadow-md">
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-4 group">
            <CircleUserIcon
              className="group-hover:stroke-primary-default"
              size={20}
            />
            <Link
              className="group-hover:text-primary-default"
              href={`/designer/${user?.username}`}
            >
              Profile
            </Link>
          </button>
          <button className="flex items-center gap-4 group">
            <FlagIcon
              className="group-hover:stroke-primary-default"
              size={20}
            />
            <span className="group-hover:text-primary-default">Plans</span>
          </button>
          <button className="flex items-center gap-4 group">
            <NewspaperIcon
              className="group-hover:stroke-primary-default"
              size={20}
            />
            <span className="group-hover:text-primary-default">Docs</span>
          </button>
          <button className="flex items-center gap-4 group">
            <CogIcon className="group-hover:stroke-primary-default" size={20} />
            <span className="group-hover:text-primary-default">Settings</span>
          </button>
          <button
            onClick={() =>
              signOut({
                callbackUrl: "/p/playground",
              })
            }
            className="flex items-center gap-4"
          >
            <ArrowRightFromLineIcon className="stroke-red-500" size={20} />
            <span className="text-red-500">Logout</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
