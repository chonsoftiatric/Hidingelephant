"use client";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { useGlobalStore } from "@/store/global";
import React from "react";
import Img2ImgPromptBar from "../../elements/Img2ImgPromptBar";
import Image from "next/image";
import PromptSettings from "@/components/layout/LogoMaker/PromptSettings";

const GenerateSimilarDialog = () => {
  const { generateSimilarImage, setGenerateSimilarImage } = useGlobalStore();
  const isOpen = Boolean(generateSimilarImage);
  const closeDialog = () => setGenerateSimilarImage(undefined);
  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-3xl p-10">
        {generateSimilarImage ? (
          <>
            <div className="flex flex-col sm:flex-row">
              <Image
                src={generateSimilarImage.imageUrl}
                height={300}
                width={300}
                className="w-full h-full sm:max-w-[60%] aspect-square object-cover rounded-md"
                alt=""
              />

              <div className="max-h-[500px] max-sm:hidden no-scrollbar overflow-auto">
                <PromptSettings />
              </div>
            </div>
            <Img2ImgPromptBar
              subProjectId={`${generateSimilarImage.subProjectId}`}
              image={generateSimilarImage}
              closeDialog={() => closeDialog()}
              successCB={(data) => {
                if (generateSimilarImage.cb) {
                  generateSimilarImage.cb(data);
                }
              }}
              className="flex-col mt-6"
            />
          </>
        ) : null}
      </DialogContent>
      <DialogOverlay withOverlay={true} />
    </Dialog>
  );
};

export default GenerateSimilarDialog;
