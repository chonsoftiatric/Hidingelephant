import useFeatureAccess from "@/hooks/useFeatureAccess";
import saveAs from "file-saver";
import { ArrowDownToLine } from "lucide-react";
import SVGPanZoom from "./SvgPanZoom";

type IShowSvg = {
  svg: string;
  className?: string;
};

const ShowSvg: React.FC<IShowSvg> = ({ svg }) => {
  const { hasFeatureAccess } = useFeatureAccess();
  const handleDwonloard = () => {
    const access = hasFeatureAccess("download");
    if (!access) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    saveAs(blob, "vector.svg");
  };

  return (
    <>
      {svg ? (
        <div className="rounded-2xl overflow-hidden relative">
          <div
            className="absolute top-1.5 right-1.5 h-10 w-10 rounded-full bg-white flex justify-center items-center hover:scale-110 shadow-md cursor-pointer"
            onClick={handleDwonloard}
          >
            <ArrowDownToLine />
          </div>
          <SVGPanZoom>
            <svg
              className="vectorized_svg"
              dangerouslySetInnerHTML={{ __html: svg }}
              viewBox="0 0 512 512"
            ></svg>
          </SVGPanZoom>
        </div>
      ) : null}
    </>
  );
};

export default ShowSvg;
