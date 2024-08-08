"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface IUserAvatarProps {
  avatarSize?: string;
  username: string | null;
  imageUrl: string | undefined;
}

export const ExploreUserAvatar = (props: IUserAvatarProps) => {
  const { push } = useRouter();
  return (
    <div className="flex items-center gap-4 cursor-pointer">
      <Avatar
        className={
          props.avatarSize
            ? `w-${props.avatarSize} h-${props.avatarSize}`
            : "w-8 h-8"
        }
        onClick={() => {
          push(`/designer/${props.username}`);
        }}
      >
        <AvatarImage src={props.imageUrl || undefined} />
        <AvatarFallback className="text-sm uppercase">
          {props?.username ? props.username[0] : "_"}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
