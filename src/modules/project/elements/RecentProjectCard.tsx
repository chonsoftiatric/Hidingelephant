import { IRecentPrompts } from "@/modules/project/types/api.response.types";
import { formatDistance } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const RecentProjectCard: React.FC<IRecentPrompts> = ({
  prompts,
  project,
  id,
}) => {
  const { replace } = useRouter();

  const onOpenProject = () => {
    replace(`/p/${id}`);
  };
  const firstImage = prompts[0].images[0];
  return (
    <div
      className="p-3 border-[1px] border-light-gray rounded-xl hover:shadow-xl cursor-pointer"
      onClick={onOpenProject}
    >
      <h3 className="cursor-pointer font-semibold">{project?.name}</h3>
      <p className="text-[#AFAFAF]">
        {prompts[0].images.length} Images |{" "}
        {formatDistance(new Date(firstImage.createdAt), new Date(), {
          addSuffix: true,
        })}
      </p>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {prompts[0].images.map((item, index) =>
          index < 6 ? (
            <Image
              key={`${index}-recent-prompts-image`}
              src={item.imageUrl}
              height={105}
              width={105}
              alt="search result"
              className="rounded-xl"
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default RecentProjectCard;
