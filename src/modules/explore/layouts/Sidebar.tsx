import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import { UserIdentity } from "@/common/components/UserIdentity";
import { UserMenu } from "@/common/components/UserMenu";
import { Button } from "@/components/ui/button";
import { useUserDetails } from "@/services/user.service";
import Link from "next/link";

export const ExploreSidebar = () => {
  const { data: user } = useUserDetails();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu size={24} className="md:hidden" />
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between py-4">
        <SheetDescription className="mt-12 text-xl flex flex-col gap-4">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/explore/tag/all">Explore</Link>
          <Link href="http://blog.hidingelephant.com">Blog</Link>
          {/* @temp hidden */}
          {/* <Link href="/pricing">Pricing</Link> */}
        </SheetDescription>

        <SheetFooter>
          {user ? (
            <div className="flex justify-between">
              <UserIdentity />
              <UserMenu />
            </div>
          ) : (
            <Button size={"sm"} className="px-8">
              Login
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
