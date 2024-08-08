import { useEffect, useState } from "react";

export type ISize = {
  height: number;
  width: number;
};

export const useGetWindowSize = () => {
  const [size, setSize] = useState<ISize>({
    height: 0,
    width: 0,
  });

  const updateSize = () => {
    setSize({ height: window.innerHeight, width: window.innerWidth });
  };

  useEffect(() => {
    setSize({height : window.innerHeight, width : window.innerWidth})
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return {
    size,
  };
};
