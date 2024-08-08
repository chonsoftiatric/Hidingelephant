"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SliderView from "@/components/view/SliderView";
import { IModelSettings } from "@/types/vercel-kv";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Generate } from "@/app/schema/generate";

const Prompt = ({
  payload,
  setPayload,
  handleGenerate,
  isLoading,
  modelSettings,
}: {
  payload: Generate;
  setPayload: React.Dispatch<React.SetStateAction<Generate>>;
  handleGenerate: () => void;
  isLoading: boolean;
  modelSettings: IModelSettings | null;
}) => {
  const modelEndponts = modelSettings?.models
    ? modelSettings?.models?.map((item) => ({
        label: item.label,
        value: item.name,
      }))
    : [];
  const samplingMethods = modelSettings?.models
    ? modelSettings?.methods?.map((item) => ({
        label: item.label,
        value: item.name,
      }))
    : [];

  return (
    <div className="flex w-full flex-col gap-y-6 mb-20 relative">
      <Textarea
        value={payload.prompt}
        onChange={(e) => setPayload({ ...payload, prompt: e.target.value })}
        className="w-full"
        placeholder="Type a prompt for the logo"
      />
      <Textarea
        value={payload.negativePrompt}
        onChange={(e) =>
          setPayload({ ...payload, negativePrompt: e.target.value })
        }
        className="w-full"
        placeholder="Negative Prompt"
      />
      <div className="flex gap-x-2 w-full">
        <Select
          value={payload.elephantBrain}
          onValueChange={(val) =>
            setPayload({ ...payload, elephantBrain: val })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Elephant brain" />
          </SelectTrigger>
          <SelectContent className="w-[180px]">
            <SelectGroup>
              <SelectLabel>Elephant brain</SelectLabel>
              {samplingMethods?.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={payload.elephantModel}
          onValueChange={(val) =>
            setPayload({ ...payload, elephantModel: val })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Elephant model" />
          </SelectTrigger>
          <SelectContent className="w-[180px]">
            <SelectGroup>
              <SelectLabel>Elephant model</SelectLabel>
              {modelEndponts?.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <SliderView
        title="Quality"
        value={payload.quality}
        onChange={(value) => {
          setPayload({ ...payload, quality: value });
        }}
        min={10}
        max={50}
        defaultValue={30}
      />
      <SliderView
        title="number of images"
        value={payload.numberOfImages}
        onChange={(value) => {
          setPayload({ ...payload, numberOfImages: value });
        }}
        min={0}
        defaultValue={2}
        max={4}
      />

      <SliderView
        title="CFG Scale"
        value={payload.cfg}
        onChange={(value) => {
          setPayload({ ...payload, cfg: value });
        }}
        min={0}
        defaultValue={7}
        max={30}
      />

      <div className="flex flex-col gap-y-2">
        <label className="text-slate-600">Seed</label>
        <Input
          type="number"
          placeholder="-1"
          value={payload.seed}
          max={10000}
          onChange={(e) => setPayload({ ...payload, seed: +e.target.value })}
        />
      </div>
      <Button onClick={handleGenerate} disabled={isLoading}>
        Generate
      </Button>
    </div>
  );
};

export default Prompt;
