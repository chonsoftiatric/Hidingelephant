"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserDetails } from "@/services/user.service";
import { useRouter } from "next/navigation";

export const UserIdentity = () => {
  const { data: user } = useUserDetails();
  const { replace } = useRouter();
  const username = user?.username || "";
  return (
    <div
      className="flex items-center gap-4 cursor-pointer"
      onClick={() => {
        replace(`/designer/${user?.username}`);
      }}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={user?.profileImage || undefined} />
        <AvatarFallback className="text-sm uppercase">
          {username[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <p>{user?.username}</p>
    </div>
  );
};
