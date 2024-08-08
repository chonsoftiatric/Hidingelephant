"use client";

import { cn, downloadBase64AsFile } from "@/lib/utils";
import { useState } from "react";
import Prompt from "./components/propmt";
import React from "react";

import axios from "axios";
import toast from "react-hot-toast";
import { Generate } from "@/app/schema/generate";
import { Skeleton } from "@/components/ui/skeleton";
import Base64Image from "@/components/view/Base64Image";
import { Button } from "@/components/ui/button";
import { IModelSettings } from "@/types/vercel-kv";
import { useModelSettings } from "@/services/vercel-kv.service";

const LogoMaker = () => {
  const { data } = useModelSettings();
  const [modelSettings, setModelSettings] =
    React.useState<IModelSettings | null>(null);
  const [generatePayload, setGeneratPayload] = useState<Generate>({
    prompt: "",
    negativePrompt: "",
    elephantBrain: "",
    elephantModel: "",
    quality: 30,
    numberOfImages: 2,
    cfg: 7,
    seed: -1,
  });
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState("prompt");

  const handleGenerate = async () => {
    if (!modelSettings) return;
    if (!generatePayload.prompt) {
      toast.error("Please enter a prompt");
      return;
    }
    if (!generatePayload.negativePrompt) {
      toast.error("Please enter a negative prompt");
      return;
    }
    // update prompt
    generatePayload.prompt = `${generatePayload.prompt}`;
    // update negative prompt
    generatePayload.negativePrompt = generatePayload.negativePrompt;

    setLoading(true);
    await axios
      .post("/api/generate", generatePayload)
      .then((res) => {
        setGeneratedImages(res.data.output.images);
        if (res.data.output.images.length > 0) {
          setCurrentTab("generated");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
    setCurrentTab("download");
  };

  const handleDownload = () => {
    downloadBase64AsFile(selectedImage, "logo.png");
  };

  return (
    <>
      <div className="w-96 p-4 sticky bg-slate-100 rounded-sm flex flex-col gap-y-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Logo Maker</h1>
          <p className="text-sm text-gray-500">
            Create a logo for your business
          </p>
        </div>
        <div className="flex flex-col gap-y-2">
          <button
            className={cn(
              "flex items-center gap-x-2 px-4 py-2 w-full text-sm text-gray-500 hover:text-gray-700 hover:bg-slate-200",
              currentTab === "prompt" &&
                "bg-slate-200 border-l-4 border-slate-500"
            )}
          >
            Propmpt
          </button>
          <button
            className={cn(
              "flex items-center rounded-md gap-x-2 px-4 py-2 w-full text-sm text-gray-500 hover:text-gray-700 hover:bg-slate-200",
              currentTab === "generated" && "bg-slate-200"
            )}
          >
            Ai generator
          </button>
          <button
            className={cn(
              "flex items-center rounded-md gap-x-2 px-4 py-2 w-full text-sm text-gray-500 hover:text-gray-700 hover:bg-slate-200",
              currentTab === "download" && "bg-slate-200"
            )}
          >
            Download
          </button>
        </div>
      </div>
      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          {currentTab === "prompt" && (
            <Prompt
              modelSettings={modelSettings}
              payload={generatePayload}
              setPayload={setGeneratPayload}
              handleGenerate={handleGenerate}
              isLoading={loading}
            />
          )}
          {currentTab === "generated" && (
            <div className="grid grid-cols-2 gap-6 w-full">
              {generatedImages.map((image: string, index: number) => {
                return (
                  <div key={index} className="relative">
                    <Base64Image base64String={image} />
                    <Button
                      className="absolute top-2 left-2"
                      onClick={() => handleSelectImage(image)}
                    >
                      Select
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          {currentTab === "download" && (
            <div className="w-full h-full relative">
              <Base64Image base64String={selectedImage} />
              <Button
                onClick={handleDownload}
                className="absolute top-2 left-2"
              >
                Download
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LogoMaker;
