import React, { useRef, useEffect } from "react";
import { UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";

type ISVGPanZoom = {
  children: React.ReactNode;
};

const SVGPanZoom: React.FC<ISVGPanZoom> = ({ children }) => {
  const Viewer = useRef<any>(null);

  useEffect(() => {
    Viewer.current.fitToViewer();
  }, []);

  return (
    <div>
      <UncontrolledReactSVGPanZoom
        ref={Viewer}
        width={400}
        height={400}
        detectAutoPan={false}
      >
        <svg height={400} width={400} viewBox="0 0 400 400">
          {children}
        </svg>
      </UncontrolledReactSVGPanZoom>
    </div>
  );
};

export default SVGPanZoom;
