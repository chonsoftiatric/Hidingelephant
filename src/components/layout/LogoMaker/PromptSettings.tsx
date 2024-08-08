"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectGroup,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectLabel,
} from "@/components/ui/select";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import LabelInfo from "@/components/common/LabelInfo";
import LogosToGenerate from "@/modules/project/elements/LogosToGenerate";
import { Slider } from "@/components/ui/slider";
import { usePromptStore } from "@/store/prompt-settings";
import { useVercelKV } from "@/store/vercel-kv";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CFG_SCALE_VAL, DALL_E_MODEL } from "@/utils/CONSTANTS";

const PromptSettings = () => {
  const promptState = usePromptStore();
  const { modelSettings } = useVercelKV();

  const elephantBrainOptions =
    modelSettings?.models?.map((item) => ({
      label: item.label,
      value: item.name,
    })) || [];
  const elephantStyleOptions =
    modelSettings?.methods?.map((item) => ({
      label: item.label,
      value: item.name,
    })) || [];
  const isGV = promptState.elephantBrain === "GV";
  const isDALL_E = promptState.elephantBrain === DALL_E_MODEL;

  return (
    <ScrollArea className="w-full h-[calc(100vh-50px)] max-xl:mt-4">
      <div className="flex flex-col gap-6 p-4 mt-3 w-full">
        <p className="text-lg font-semibold mb-2 ml-3">Prompt Settings</p>
        {/* Elephant Model */}
        <div>
          <LabelInfo
            label="Elephant Brain"
            infoText="This is the model you use to generate image; each model has different strengths and capabilities. Experiment with the models to find the one that best suits your design needs."
          />
          <Select
            value={promptState.elephantBrain}
            onValueChange={(val) => {
              promptState.setElephantBrain(val);
              promptState.setChangeModelMessageShow(false);
            }}
          >
            <SelectTrigger className="py-5 rounded-xl">
              <SelectValue placeholder="Elephant Brain" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Elephant Brain</SelectLabel>
                {elephantBrainOptions.map((item) => (
                  <SelectItem
                    className="cursor-pointer"
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
            {promptState.changeModelMessageShow ? (
              <p className="text-xs mt-1 text-red-600">
                feature not available for this model, please try a different
                model
              </p>
            ) : null}
          </Select>
        </div>
        {/* Elephant Style */}
        <div>
          <LabelInfo
            label="Elephant Style"
            infoText="This is the style in which the logos will be generated. Experiment with different styles to see which one best matches your creative vision."
          />
          <Select
            value={promptState.elephantModel}
            onValueChange={(val) => promptState.setElephantStyle(val)}
            disabled={isGV || isDALL_E}
          >
            <SelectTrigger className="py-5 rounded-xl">
              <SelectValue placeholder="Elephant Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Elephant Style</SelectLabel>
                {elephantStyleOptions.map((item) => (
                  <SelectItem
                    className="cursor-pointer"
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* Logos to generate */}
        <LogosToGenerate />

        {/* Quality */}
        <div className="mt-3">
          <LabelInfo
            className="mb-2"
            label="Quality"
            infoText="Adjust the quality on a scale from 10 to 50. Higher values result in higher-quality logos and will cost more credits."
          />
          <div className="flex gap-2 items-center">
            <Slider
              value={[promptState.quality]}
              step={1}
              min={10}
              max={50}
              onValueChange={(value) => promptState.setQuality(value[0])}
              disabled={isGV || isDALL_E}
            />
            <Input
              type="number"
              value={promptState.quality}
              max={50}
              min={10}
              className="w-[55px] h-8 p-2 py-5 rounded-xl"
              onChange={(e) => promptState.setQuality(parseInt(e.target.value))}
              disabled={isGV || isDALL_E}
            />
          </div>
        </div>

        {/* CFG Scale */}
        <div>
          <LabelInfo
            className="mb-2"
            label="CFG Scale"
            infoText="This determines how closely the generation follows the prompt. Low values allow more creativity, while high values adhere more strictly to the prompt."
          />
          <Menubar defaultValue="medium" className="justify-center py-6">
            <MenubarMenu value="low">
              <MenubarTrigger
                onPointerMove={(e) => e.preventDefault()}
                onPointerEnter={(e) => e.preventDefault()}
                onPointerLeave={(e) => e.preventDefault()}
                onClick={() => promptState.setCFG(CFG_SCALE_VAL.low)}
                className="data-[state=open]:bg-primary-default data-[state=open]:text-white cursor-pointer"
                disabled={isDALL_E}
              >
                Low
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu value="medium">
              <MenubarTrigger
                onPointerMove={(e) => e.preventDefault()}
                onPointerEnter={(e) => e.preventDefault()}
                onPointerLeave={(e) => e.preventDefault()}
                onClick={() => promptState.setCFG(CFG_SCALE_VAL.medium)}
                className="data-[state=open]:bg-primary-default data-[state=open]:text-white cursor-pointer"
                disabled={isDALL_E}
              >
                Medium
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu value="high">
              <MenubarTrigger
                onPointerMove={(e) => e.preventDefault()}
                onPointerEnter={(e) => e.preventDefault()}
                onPointerLeave={(e) => e.preventDefault()}
                onClick={() => promptState.setCFG(CFG_SCALE_VAL.high)}
                className="data-[state=open]:bg-primary-default data-[state=open]:text-white cursor-pointer"
                disabled={isDALL_E}
              >
                High
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </div>

        <div>
          <LabelInfo
            className="mb-2"
            label="Seed"
            infoText="Set a seed for random generation or use the same seed for consistent results across different generations."
          />
          <Input
            type="number"
            placeholder="-1"
            value={promptState.seed}
            max={10000}
            onChange={(e) => promptState.setSeed(parseInt(e.target.value))}
            className="py-5 rounded-xl"
            disabled={isDALL_E || isGV}
          />
        </div>

        {/* Negative Prompt */}
        <div>
          <LabelInfo
            label="Negative Prompt"
            infoText="Specify elements you do not want to appear in your logo designs. This helps refine the output by excluding unwanted features."
            className="mb-2"
          />
          <Textarea
            value={promptState.negativePrompt}
            onChange={(e) => promptState.setNegativePrompt(e.target.value)}
            className="w-full rounded-lg"
            placeholder="Type something you don’t want to see in your logo"
            disabled={isDALL_E}
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default PromptSettings;
