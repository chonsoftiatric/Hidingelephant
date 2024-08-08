import React from "react";
import { ButtonProps, Button as ShadButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IButton = {
  children?: React.ReactNode;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & ButtonProps;
const Button = ({
  children,
  className,
  leftIcon,
  rightIcon,
  ...rest
}: IButton) => {
  return (
    <ShadButton
      className={cn(
        "bg-primary-default rounded-full hover:bg-primary-hover ease-in-out hover:shadow-md duration-150 scale-90 sm:scale-100",
        className,
        rest.variant === "outline"
          ? "bg-white border-primary-default text-primary-default hover:bg-primary-default/5 hover:text-primary-default"
          : ""
      )}
      {...rest}
    >
      <span className="flex gap-2 items-center">
        {leftIcon ? leftIcon : null}
        {children}
        {rightIcon ? rightIcon : null}
      </span>
    </ShadButton>
  );
};

export default Button;
