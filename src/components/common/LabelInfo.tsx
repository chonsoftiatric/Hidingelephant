import React from "react";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type ILabelInfo = {
  label: string;
  infoText: string;
  className?: string;
};
const LabelInfo = ({ infoText, label, className }: ILabelInfo) => {
  return (
    <div className={cn("flex gap-2 mb-1", className)}>
      <Label>{label}</Label>
      <Tooltip>
        <TooltipTrigger>
          <InfoCircledIcon color="#AFAFAF" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[400px]">{infoText}</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default LabelInfo;
