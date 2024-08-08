import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActiveItemButtonPropsI {
  icon: any;
  label: string;
  onClick: any;
  disabled?: boolean;
  tooltip?: string;
}

export const ActiveItemButton = (props: ActiveItemButtonPropsI) => {
  return (
    <button
      key={props.label}
      className="flex gap-1 items-center text-sm disabled:cursor-not-allowed hover:text-primary-hover group"
      onClick={props.onClick}
      disabled={props?.disabled}
    >
      {props.tooltip ? (
        <Tooltip>
          <TooltipTrigger className="flex gap-1 items-center">
            {props.icon}{" "}
            <span className="text-medium-gray group-hover:text-primary-default">
              {props.label}
            </span>
          </TooltipTrigger>
          <TooltipContent>{props.tooltip} </TooltipContent>
        </Tooltip>
      ) : (
        <>
          {props.icon}
          <span className="text-medium-gray group-hover:text-primary-default">
            {props.label}
          </span>
        </>
      )}
    </button>
  );
};
