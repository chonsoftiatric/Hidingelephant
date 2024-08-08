import { Slider } from "@/components/ui/slider";
import React from "react";

type Props = {
  title: string;
  value: number;
  onChange: (value: number) => void;
  defaultValue?: number;
  min?: number;
  max?: number;
  steps?: number;
};
const SliderView = ({
  title,
  value,
  onChange,
  defaultValue,
  min,
  max,
  steps,
}: Props) => {
  return (
    <div className="flex flex-col gap-y-2">
      <label className="text-slate-600">
        {title}
        <span className="text-slate-600 p-1 text-sm bg-gray-100 rounded-md ml-1">
          {value}
        </span>
      </label>
      <Slider
        value={[value]}
        step={steps}
        min={min}
        max={max}
        defaultValue={[defaultValue ?? 50]}
        onValueChange={(value) => onChange(value[0])}
      />
      <div className="flex items-center justify-between">
        <span className="text-slate-600 ml-1">{min}</span>
        <span className="text-slate-600">{max}</span>
      </div>
    </div>
  );
};

export default SliderView;
