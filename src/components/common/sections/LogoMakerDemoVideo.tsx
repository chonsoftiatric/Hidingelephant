import { cn } from "@/lib/utils";
import React from "react";

type ILogoMakerDemoVideo = {
  className?: string;
} & React.ComponentProps<"section">;
const LogoMakerDemoVideo = ({ className, ...props }: ILogoMakerDemoVideo) => {
  return (
    <section
      className={cn("card mt-24 section-container z-10 relative", className)}
      {...props}
      id="watch-demo"
    >
      <video style={{ width: "100%" }} className="rounded-lg" controls>
        <source src="/video/hiding-elephant-logo-maker.mp4" />
      </video>
    </section>
  );
};

export default LogoMakerDemoVideo;
