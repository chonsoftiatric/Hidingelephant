"use client";
import Button from "@/components/common/button/Button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { useGlobalStore } from "@/store/global";
import { Brush, Eraser, RotateCcw } from "lucide-react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import Resizer from "react-image-file-resizer";
import { useParams } from "next/navigation";
import Img2ImgPromptBar from "./Img2ImgPromptBar";
import PromptSettings from "@/components/layout/LogoMaker/PromptSettings";

const EditImageModal = () => {
  const params = useParams();
  const imageFormat = "png";
  const maskSize = 512;

  const { editImageModal, updateEditImageModal } = useGlobalStore();
  const [canvasSettings, setCanvasSetting] = useState({
    brush: true,
    brushSize: 18,
    eraserSize: 18,
  });
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [maskBase64, setMaskBase64] = useState<string>();

  const closeDialog = () => {
    updateEditImageModal(undefined);
  };

  const toggleBrush = () => {
    setCanvasSetting((state) => ({ ...state, brush: !state.brush }));
    canvasRef.current?.eraseMode(canvasSettings.brush);
  };

  // Convert white pixels to transparent pixels
  const convertWhiteToTransparent = (base64Image: string) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = maskSize;
        canvas.height = maskSize;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, maskSize, maskSize);

        const data = imageData.data;

        // convert all transparent pixels into black
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] === 0) {
            // If alpha channel (transparency) is 0
            data[i] = 0; // Set red channel to black
            data[i + 1] = 0; // Set green channel to black
            data[i + 2] = 0; // Set blue channel to black
            data[i + 3] = 255;
          }
        }

        for (let i = 0; i < data.length; i += 4) {
          if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  // image selection mask of user selection in 512 512 size
  const exportMask = async () => {
    const image = await canvasRef.current?.exportImage(imageFormat);
    const response = await fetch(image as string);
    const imageBlob = await response.blob();
    Resizer.imageFileResizer(
      imageBlob,
      maskSize,
      maskSize,
      imageFormat,
      100,
      0,
      async (uri) => {
        // output image
        const transparentMask = (await convertWhiteToTransparent(
          uri as string
        )) as string;
        setMaskBase64(transparentMask);
      },
      "base64",
      maskSize,
      maskSize
    );
  };

  const handleCanvasReset = async () => {
    canvasRef.current?.resetCanvas();
  };

  return (
    <Dialog open={Boolean(editImageModal)} onOpenChange={closeDialog}>
      <DialogContent className="max-w-4xl p-10">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <ReactSketchCanvas
              ref={canvasRef}
              height={"400"}
              width={"400"}
              backgroundImage={editImageModal?.imageUrl}
              canvasColor="black"
              strokeColor="white"
              className="rounded-xl h-[400px] w-[400px] cursor-pointer"
              strokeWidth={canvasSettings.brushSize}
              eraserWidth={canvasSettings.eraserSize}
              style={{ borderRadius: "1.5 rem" }}
              onStroke={() => {
                exportMask();
              }}
            />

            <div className="max-h-[500px] max-sm:hidden no-scrollbar overflow-auto">
              <div className="flex flex-col items-start gap-5 p-5">
                {/* Brush button */}
                <div className="flex gap-3 items-center">
                  <Button
                    className="rounded-xl p-3"
                    variant={canvasSettings.brush ? "default" : "outline"}
                    onClick={toggleBrush}
                  >
                    <Brush />
                  </Button>
                  <h3 className="font-medium">Brush</h3>

                  <Slider
                    max={100}
                    step={1}
                    min={1}
                    value={[canvasSettings.brushSize]}
                    onValueChange={(value) =>
                      setCanvasSetting((state) => ({
                        ...state,
                        brushSize: value[0],
                      }))
                    }
                    className="w-[200px]"
                  ></Slider>
                </div>
                {/* Erase button */}
                <div className="flex gap-3 items-center">
                  <Button
                    className="rounded-xl p-3"
                    onClick={toggleBrush}
                    variant={!canvasSettings.brush ? "default" : "outline"}
                  >
                    <Eraser />
                  </Button>
                  <h3 className="font-medium">Eraser</h3>
                  <Slider
                    max={100}
                    step={1}
                    min={1}
                    value={[canvasSettings.eraserSize]}
                    onValueChange={(value) =>
                      setCanvasSetting((state) => ({
                        ...state,
                        eraserSize: value[0],
                      }))
                    }
                    className="w-[200px]"
                  ></Slider>
                </div>

                {/* Reset Button */}
                <div className="flex gap-3 items-center">
                  <Button
                    variant={"outline"}
                    className="rounded-xl p-3"
                    onClick={handleCanvasReset}
                  >
                    <RotateCcw />
                  </Button>
                  <h3>Reset</h3>
                </div>

                <p className="text-light-gray">
                  {`Paint over the selection you'd like to edit and type what you
                want instead`}
                </p>
              </div>
              {/* <PromptSettings /> */}
            </div>
          </div>
          <div className="grid">
            {editImageModal ? (
              <Img2ImgPromptBar
                subProjectId={params.id as string}
                image={editImageModal}
                maskBase64={maskBase64}
                closeDialog={closeDialog}
                successCB={(prompt) => {
                  if (editImageModal.cb) {
                    editImageModal.cb(prompt);
                  }
                }}
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
      <DialogOverlay withOverlay={true} />
    </Dialog>
  );
};

export default EditImageModal;
