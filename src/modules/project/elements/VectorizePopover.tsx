import React, { useEffect } from "react";
import { ArrowDownToLine, SplineIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetSavedVectorizedImage } from "@/services/vectorize.service";
import { motion, useAnimate } from "framer-motion";
import useFeatureAccess from "@/hooks/useFeatureAccess";
import saveAs from "file-saver";
import { useGlobalStore } from "@/store/global";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type VectorizePopoverProps = {
  className?: string;
  subProjectId: string | number;
};
const VectorizePopover = ({
  className,
  subProjectId,
}: VectorizePopoverProps) => {
  const { vectorizeModal, updateSaveIconAnimation } = useGlobalStore();
  const { hasFeatureAccess } = useFeatureAccess();
  const { data } = useGetSavedVectorizedImage(subProjectId);
  const [scope, animate] = useAnimate();

  const onDownloadImage = async (imageUrl: string) => {
    //@todo fix cors error while fetching image for download
    const access = hasFeatureAccess("download");
    if (!access) return;
    try {
      const res = await fetch(imageUrl, { method: "GET" });
      const blob = await res.blob();
      saveAs(blob, "image.svg");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (vectorizeModal.animateIcon === true) {
      // animation vectorized tab icon
      animate(scope.current, {
        scale: [1, 2, 2.2, 1.8, 1],
        opacity: [0.2, 0.5, 0.6, 0.8, 1],
        delay: 1.5,
        backgroundColor: [
          "#0D6EFD",
          "#0D6EFD",
          "#0D6EFD",
          "#FFFFFF",
          "#FFFFFF",
        ],
        color: ["#fff", "#fff", "#fff", "#fff", "#000"],
      });
      updateSaveIconAnimation(false);
    }
  }, [vectorizeModal.animateIcon]);

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <div
              ref={scope}
              className={cn(
                "absolute card z-10 flex h-10 w-10 bg-white cursor-pointer  rounded-full justify-center items-center top-[70px] right-6 border p-2",
                className
              )}
            >
              <motion.div>
                <SplineIcon size={22} className="hover:text-primary-default" />
              </motion.div>
            </div>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Vectorized Images</TooltipContent>
      </Tooltip>

      <PopoverContent>
        <motion.div
          initial={{
            opacity: 0,
            x: -50,
          }}
          transition={{ duration: 0.125 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h5 className="text-lg font-semibold mb-2">Vectorized Images</h5>
          <ScrollArea className="max-w-[500px] h-[350px] ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-3">
              {data?.map((item, index) => (
                <div className="relative" key={`vectorized-image-${index}`}>
                  <button
                    onClick={() => onDownloadImage(item.image_url)}
                    className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md hover:scale-105"
                  >
                    <ArrowDownToLine
                      className="stroke-primary-default fill-primary-default"
                      size={16}
                    />
                  </button>
                  <Image
                    src={item.image_url}
                    alt="vectorized image"
                    height={130}
                    width={130}
                    className="rounded-xl shadow-md"
                    quality={0.01}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default VectorizePopover;
