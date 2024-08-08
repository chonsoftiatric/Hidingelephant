import React from "react";
import { cn } from "@/lib/utils";
import TextLogo from "@/components/common/elements/TextLogo";
import JoinWaitingListButton from "@/components/common/elements/JoinWaitingListButton";
import Button from "../common/button/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

type IHeaderMinimal = {
  className?: string;
};

const HeaderMinimal = ({ className }: IHeaderMinimal) => {
  return (
    <header className={cn("flex justify-between p-2 container", className)}>
      <TextLogo />
      <div className="flex gap-2">
        <Link href={"https://blog.hidingelephant.com/"}>
          <Button variant={"outline"}>Blog</Button>
        </Link>
        <Link href={"/explore/tag/all "}>
          <Button variant={"outline"}>Explore</Button>
        </Link>
        <JoinWaitingListButton />
      </div>
    </header>
  );
};

export default HeaderMinimal;
