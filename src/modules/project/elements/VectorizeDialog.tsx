"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import saveAs from "file-saver";
import {
  saveVectorizedImage,
  vectorize_mutation,
} from "@/services/vectorize.service";
import { API_ROUTES } from "@/utils/API_ROUTES";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useGlobalStore } from "@/store/global";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import ShowSvg from "@/modules/project/elements/ShowSvg";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/common/button/Button";
import { queryClient } from "@/providers/TanstackProvider";
import useFeatureAccess from "@/hooks/useFeatureAccess";
import { IVectorizeOptions } from "@/schemas/vectorize/schema";
import { ICurrentUserProjectsList } from "@/types/project.types";
// import { Switch } from "@/components/ui/switch";

const rangeInputs: Array<{
  name: string;
  key: any;
  max: number;
  step: number;
}> = [
  {
    key: "filter_speckle",
    name: "Filter speckle",
    step: 1,
    max: 128,
  },
  {
    key: "color_precision",
    name: "Color precision",
    step: 1,
    max: 8,
  },
  {
    key: "layer_difference",
    name: "Layer difference",
    step: 1,
    max: 128,
  },
  {
    key: "corner_threshold",
    name: "Corner threshold",
    step: 1,
    max: 180,
  },
  {
    key: "length_threshold",
    name: "Length threshold",
    step: 0.1,
    max: 10,
  },
  {
    key: "max_iterations",
    name: "Max iterations",
    step: 1,
    max: 180,
  },
  {
    key: "splice_threshold",
    name: "Splice threshold",
    step: 1,
    max: 180,
  },
  {
    key: "path_precision",
    name: "Path precision",
    step: 1,
    max: 180,
  },
];

const Vectorize_options = ({
  onApplySetting,
  vectorizeWithAI,
}: {
  onApplySetting: (options: IVectorizeOptions) => void;
  vectorizeWithAI: boolean;
}) => {
  const [options, setOptions] = useState<IVectorizeOptions>({
    colormode: "color",
    hierarchical: "stacked",
    mode: "spline",
    filter_speckle: 4,
    color_precision: 6,
    layer_difference: 16,
    corner_threshold: 60,
    length_threshold: 4.0,
    max_iterations: 10,
    splice_threshold: 45,
    path_precision: 3,
  });

  const onButtonChange = (key: any, value: string) => {
    setOptions((state) => ({ ...state, [key]: value }));
  };

  const onSlideChange = (key: string, value: number) => {
    setOptions((state) => ({ ...state, [key]: value }));
  };

  const onResetSettings = () => {
    setOptions({
      colormode: "color",
      hierarchical: "stacked",
      mode: "spline",
      filter_speckle: 4,
      color_precision: 6,
      layer_difference: 16,
      corner_threshold: 60,
      length_threshold: 4.0,
      max_iterations: 10,
      splice_threshold: 45,
      path_precision: 3,
    });
  };

  return (
    <div>
      {!vectorizeWithAI ? (
        <div className="flex flex-col gap-2">
          <Label>Color mode</Label>
          <div className="flex gap-2">
            <Button
              variant={options.colormode == "binary" ? "default" : "outline"}
              size={"sm"}
              onClick={() => onButtonChange("colormode", "binary")}
            >
              Binary
            </Button>
            <Button
              variant={options.colormode == "color" ? "default" : "outline"}
              size={"sm"}
              onClick={() => onButtonChange("colormode", "color")}
            >
              Color
            </Button>
          </div>

          {/* Range Inputs */}

          <Label>Hierarchical</Label>
          <div className="flex gap-2">
            <Button
              size={"sm"}
              variant={
                options.hierarchical == "stacked" ? "default" : "outline"
              }
              onClick={() => onButtonChange("hierarchical", "stacked")}
            >
              Stacked
            </Button>
            <Button
              size={"sm"}
              variant={options.hierarchical == "cutout" ? "default" : "outline"}
              onClick={() => onButtonChange("hierarchical", "cutout")}
            >
              Cutout
            </Button>
          </div>
          <Label>Mode</Label>
          <div className="flex gap-2">
            <Button
              size={"sm"}
              variant={options.mode == "spline" ? "default" : "outline"}
              onClick={() => onButtonChange("mode", "spline")}
            >
              spline
            </Button>
            <Button
              size={"sm"}
              variant={options.mode == "polygon" ? "default" : "outline"}
              onClick={() => onButtonChange("mode", "polygon")}
            >
              polygon
            </Button>
            <Button
              size={"sm"}
              variant={options.mode == "none" ? "default" : "outline"}
              onClick={() => onButtonChange("mode", "none")}
            >
              none
            </Button>
          </div>

          {rangeInputs.map((item, index) => (
            <div className="" key={`${index}-slider-input-aaaaa`}>
              <Label>{item.name} </Label>
              <div className="flex gap-2">
                <Slider
                  // @ts-ignore
                  defaultValue={[options[item.key]]}
                  max={item.max}
                  step={item.step}
                  onValueChange={(value) => onSlideChange(item.key, value[0])}
                  isDefault
                />
                <p className="text-xs">
                  {
                    // @ts-ignore
                    options[item.key]
                  }
                </p>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <Button onClick={onResetSettings} variant={"outline"}>
              Reset
            </Button>
            <Button onClick={() => onApplySetting(options)}>Apply</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const VectorizeDialog = () => {
  const [isvectorizeWithAI, setIsVectorizeWithAI] = useState<boolean>(false);
  const { vectorizeModal, updateVectorizeModal } = useGlobalStore();
  const subProjectId = vectorizeModal.subProjectId;
  const { hasFeatureAccess } = useFeatureAccess();
  const [svg, setSvg] = useState<string>("");
  const generateVectorize = useMutation({
    mutationFn: vectorize_mutation,
    retry: false,
    onSuccess: (response) => {
      setSvg(response);
    },
  });

  const generateVectorizedImage = (options?: IVectorizeOptions) => {
    if (vectorizeModal.open && vectorizeModal.id) {
      const vectorize_response = generateVectorize.mutateAsync({
        id: vectorizeModal.id,
        url: vectorizeModal.imageUrl,
        options: options,
      });

      toast.promise(vectorize_response, {
        loading: "Vectorizing...",
        success: "Image Vectorized",
        error: (err) => err?.response?.statusText,
      });
    }
  };

  const saveImageMutation = useMutation({
    mutationFn: saveVectorizedImage,
    onSuccess: () => {
      updateVectorizeModal({
        open: false,
        id: undefined,
        imageUrl: "",
        saveKey: "",
        animateIcon: true,
        subProjectId: undefined,
      });
      let id = subProjectId;

      const projects = queryClient.getQueryData<ICurrentUserProjectsList[]>([
        API_ROUTES.PROJECTS.CURRENT_USER_PROJECTS,
      ]);
      if (projects) {
        const playgroundProject = projects.find((p) => p.type === "PLAYGROUND");
        if (playgroundProject) {
          id = playgroundProject.subProjects[0].id;
        }
      }

      if (id) {
        const key = [API_ROUTES.VECTORIZE.GET_SAVED_IMAGES(id)];
        console.log({ key: key });
        queryClient.invalidateQueries({
          queryKey: key,
        });
      }
    },
  });
  const vectorizing = generateVectorize.isPending;
  useEffect(() => {
    if (!vectorizing) {
      console.log("vectorizing");
      setSvg("");
      generateVectorizedImage();
    }
  }, [vectorizeModal]);

  const handleClose = () => {
    setSvg("");
    updateVectorizeModal({
      open: false,
      id: undefined,
      imageUrl: "",
      saveKey: "",
      subProjectId: undefined,
    });
  };

  const onSaveAndExit = () => {
    const svgBlob = new Blob([svg], { type: "image/svg+xml" });
    const svgFile = new File([svgBlob], `${uuidv4()}.svg`, {
      type: "image/svg+xml",
    });
    if (!vectorizeModal.subProjectId) {
      return toast.error("Sub project id not found!");
    }
    const status = saveImageMutation.mutateAsync({
      file: svgFile,
      saveKey: vectorizeModal.saveKey,
      imageId: vectorizeModal.id as number,
      subProjectId: vectorizeModal.subProjectId,
    });
    toast.promise(status, {
      error: (err) => err?.statusText,
      loading: "Saving...",
      success: "Image Saved",
    });
  };

  const handleImageDownload = async () => {
    if (!svg) return;
    const access = hasFeatureAccess("download");
    if (!access) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    saveAs(blob, "image.svg");
  };

  return (
    <Dialog open={vectorizeModal.open} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-md:max-h-[100vh] max-md:overflow-auto">
        <DialogHeader>
          <DialogTitle>Vectorize</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] w-full place-items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-4">
            <div className="flex flex-col items-center justify-center">
              <h1 className="font-medium mb-5">Original</h1>
              <Image
                src={vectorizeModal.imageUrl}
                alt="prompt image"
                height={400}
                width={400}
                className="rounded-2xl"
              />
            </div>
            {svg == "" ? (
              <h1>Loading...</h1>
            ) : (
              <div className="flex flex-col items-center justify-center ">
                <h1 className="font-medium mb-5">Vectorized</h1>
                <ShowSvg svg={svg} />
              </div>
            )}

            <div className="md:col-span-2 max-md:mb-10">
              {/* vectorize with vectorize.ai */}
              {/* <div className="flex items-center gap-5">
               { isvectorizeWithAI &&  <Button onClick={handleVectorizeWithAi}>
                  Generate
                </Button>}
                <Switch
                  checked={isvectorizeWithAI}
                  onCheckedChange={() => setIsVectorizeWithAI((state) => !state)}
                />
                <Label>Vectorize with AI</Label>

              </div> */}

              <div className="flex items-center gap-5">
                <PrimaryButton
                  disabled={saveImageMutation.isPending}
                  onClick={onSaveAndExit}
                  className="w-full"
                >
                  Save to project
                </PrimaryButton>
                {svg ? (
                  <PrimaryButton
                    disabled={saveImageMutation.isPending}
                    onClick={handleImageDownload}
                  >
                    Download
                  </PrimaryButton>
                ) : null}
              </div>
            </div>
          </div>
          <Vectorize_options
            onApplySetting={generateVectorizedImage}
            vectorizeWithAI={isvectorizeWithAI}
          />
        </div>
      </DialogContent>
      <DialogOverlay withOverlay />
    </Dialog>
  );
};

export default VectorizeDialog;
