import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import React from "react";

const Menu = ({
  actionText,
  options,
  onSelect,
  selected,
}: {
  actionText: string;
  options: string[];
  onSelect: (option: string) => void;
  selected: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger className="px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition duration-100 ease-in-out">
        {selected ?? actionText}
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-y-2 p-2">
        {options.map((option) => (
          <Button
            variant="ghost"
            className={cn(
              "w-full text-left",
              option === selected && "bg-gray-100"
            )}
            key={option}
            onClick={() => onSelect(option)}
          >
            {option}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default Menu;
