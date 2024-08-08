import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import { EditProfileModal } from "../components/EditProfileModal";
import Image from "next/image";
import Link from "next/link";

interface IDesignerProfileHeaderProps {
  username: string;
  firstName: string;
  lastName: string;
  avatar: string | undefined;
  imagesGenerated: number;
  totalLikes: number;
  coverImage: string | undefined;
  id: number | undefined;
  linkedinUrl: string | undefined;
  facebookUrl: string | undefined;
  twitterUrl: string | undefined;
}

export const DesignerProfileHeader = (props: IDesignerProfileHeaderProps) => {
  const coverImage = props.coverImage;
  return (
    <div className="px-0 sm:px-18 md:px-24 py-4">
      <div className="relative bg-gradient-to-br from-[rgba(244,184,255,0.2)] to-[rgba(46,157,254,0.2)] w-full h-52 rounded-b-2xl sm:rounded-2xl p-4 flex flex-col justify-between items-end">
        {coverImage ? (
          <Image
            objectFit="cover"
            layout="fill"
            src={coverImage}
            alt=""
            className="rounded-b-2xl sm:rounded-2xl"
          />
        ) : null}
        <EditProfileModal id={props.id} />
        <div className="flex gap-4 relative z-10">
          {props.facebookUrl ? (
            <Link
              href={
                props.facebookUrl.startsWith("http")
                  ? props.facebookUrl
                  : `https://${props.facebookUrl}`
              }
              target="_blank"
              className="rounded-full bg-white p-1"
            >
              <Facebook className="fill-primary-hover stroke-none" />
            </Link>
          ) : null}
          {props.twitterUrl ? (
            <Link
              href={
                props.twitterUrl.startsWith("http")
                  ? props.twitterUrl
                  : `https://${props.twitterUrl}`
              }
              target="_blank"
              className="rounded-full bg-white p-1"
            >
              <Twitter className="fill-primary-hover stroke-none" />
            </Link>
          ) : null}
          {props.linkedinUrl ? (
            <Link
              href={
                props.linkedinUrl.startsWith("http")
                  ? props.linkedinUrl
                  : `https://${props.linkedinUrl}`
              }
              target="_blank"
              className="rounded-full bg-white p-1"
            >
              <Linkedin className="fill-primary-hover stroke-none" />
            </Link>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-2 relative bottom-16 px-8">
        {props.firstName && props.lastName ? (
          <Avatar className="h-32 w-32">
            <AvatarImage src={props?.avatar || undefined} />
            <AvatarFallback className="text-sm uppercase">
              {props.firstName[0] + props.lastName[0]}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Skeleton className="h-32 w-32 rounded-full bg-gray-400" />
        )}
        <div className="bg-transparent w-full h-32"></div>
        <div className="flex items-end">
          {props.firstName && props.lastName ? (
            <p className="text-xl md:text-xl font-semibold">{`${props.firstName} ${props.lastName}`}</p>
          ) : (
            <Skeleton className="w-32 h-4 bg-gray-400" />
          )}
        </div>
        <div className=" w-full flex justify-end items-end">
          <div className="pr-4 border-r">
            <p className="text-xl font-semibold">{props.imagesGenerated}</p>
            <p className="text-gray-700 text-xs">Images Generated</p>
          </div>
          <div className="pl-4">
            <p className="text-xl font-semibold">{props.totalLikes}</p>
            <p className="text-gray-700 text-xs">Total Likes</p>
          </div>
        </div>
      </div>
    </div>
  );
};
