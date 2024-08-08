import { cn } from "@/lib/utils";
import * as React from "react";
type ISVGIcon = { className?: string } & React.ComponentProps<"svg">;
const SettingIcon: React.FC<ISVGIcon> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={22}
    fill="none"
    {...props}
    className={cn("group", props.className)}
  >
    <path
      className="group-hover:stroke-primary-default"
      stroke="#0D0C0C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m7.395 18.371.584 1.315a2.212 2.212 0 0 0 4.045 0l.584-1.315a2.426 2.426 0 0 1 2.47-1.423l1.43.152a2.212 2.212 0 0 0 2.023-3.502l-.847-1.164a2.43 2.43 0 0 1-.46-1.434c0-.513.162-1.014.464-1.429l.847-1.163a2.21 2.21 0 0 0-.785-3.274 2.212 2.212 0 0 0-1.237-.228l-1.43.152a2.434 2.434 0 0 1-1.47-.312 2.426 2.426 0 0 1-1-1.117l-.59-1.315a2.212 2.212 0 0 0-4.044 0L7.395 3.63c-.207.468-.557.86-1 1.117-.445.256-.96.365-1.47.312l-1.434-.152a2.212 2.212 0 0 0-2.023 3.502l.847 1.163a2.429 2.429 0 0 1 0 2.858l-.847 1.163a2.21 2.21 0 0 0 .786 3.273c.381.195.811.274 1.237.23l1.43-.153a2.434 2.434 0 0 1 2.474 1.43Z"
    />
    <path
      className="group-hover:stroke-primary-default"
      stroke="#0D0C0C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
    />
  </svg>
);
export default SettingIcon;
