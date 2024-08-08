"use client";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { useGlobalStore } from "@/store/global";
import React from "react";
import Img2ImgPromptBar from "../../elements/Img2ImgPromptBar";
import Image from "next/image";

import PromptSettings from "@/components/layout/LogoMaker/PromptSettings";
import Dropzone from "@/components/common/dropzone";
import { XIcon } from "lucide-react";

const SketchImageDialog = () => {
  const [sketchBase64, setSketchBase64] = React.useState("");
  const [image, setImage] = React.useState("");
  const { sketchImageDialogSubProjectId, setSketchImageDialogSubProjectId } =
    useGlobalStore();
  const isOpen = Boolean(sketchImageDialogSubProjectId);
  const closeDialog = () => setSketchImageDialogSubProjectId(undefined);
  const handleImage = (file: File) => {
    if (file) {
      const blob = URL.createObjectURL(file as File);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSketchBase64(reader.result as string);
      };
      setImage(blob);
    }
  };

  React.useEffect(() => {
    setImage("");
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-3xl p-10">
        {sketchImageDialogSubProjectId ? (
          <>
            <div className="flex gap-4">
              <div className="flex gap-6 flex-col items-center justify-center flex-1">
                {image ? (
                  <div className="relative flex-1">
                    <button
                      onClick={() => setImage("")}
                      className="h-6 w-6 flex justify-center items-center bg-white shadow-md absolute top-2 right-2 rounded-full"
                    >
                      <XIcon size={20} />
                    </button>
                    <Image
                      src={image}
                      height={300}
                      width={300}
                      alt=""
                      className="rounded-md shadow-lg"
                    />
                  </div>
                ) : null}
                <div className="h-full flex mt-auto flex-1">
                  <Dropzone
                    className="mt-auto"
                    handleDrop={(files) => handleImage(files[0])}
                    accept={{
                      "image/png": [".png"],
                      "image/jpg": [".jpg", ".jpeg"],
                    }}
                  />
                </div>
              </div>
              <div className="max-h-[500px] max-sm:hidden no-scrollbar overflow-auto flex-1">
                <PromptSettings />
              </div>
            </div>

            <Img2ImgPromptBar
              subProjectId={`${sketchImageDialogSubProjectId}`}
              image={{
                id: "",
                imageUrl: "",
              }}
              sketchBase64={sketchBase64}
              closeDialog={() => closeDialog()}
              className="flex-col mt-6"
            />
          </>
        ) : null}
      </DialogContent>
      <DialogOverlay withOverlay={true} />
    </Dialog>
  );
};

export default SketchImageDialog;
