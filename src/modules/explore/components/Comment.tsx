"use client";

import { timeAgo } from "@/common/utils/timeAgo";
import { IComment } from "../types/comment.types";
import { ExploreUserAvatar } from "@/modules/explore/components/ExploreUserAvatar";
import Link from "next/link";

export const Comment = (props: IComment) => {
  return (
    <div className="flex gap-4 items-start">
      <ExploreUserAvatar
        avatarSize="12"
        imageUrl={props.avatar}
        username={props.username}
      />
      <div className="flex flex-col gap-1">
        <div className="flex gap-3 items-center">
          <Link
            className="text-sm md:text-base font-semibold"
            href={`/designer/${props.username}`}
          >
            {props.username}
          </Link>
          <p className="text-xs lg:text-sm text-gray-400">
            {timeAgo(new Date(props.postedAt))}
          </p>
        </div>
        <p className="text-xs md:text-sm lg:text-base">{props.comment}</p>
      </div>
    </div>
  );
};
