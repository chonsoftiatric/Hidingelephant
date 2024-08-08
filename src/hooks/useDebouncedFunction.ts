import { useCallback, useRef } from "react";

const useDebouncedFunction = () => {
  const timerIdRef = useRef<NodeJS.Timeout | null>(null); // useRef for storing timerId

  const debouncedFunction = useCallback((func: () => void, delay: number) => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    timerIdRef.current = setTimeout(() => {
      func();
    }, delay);

    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  return debouncedFunction;
};

export default useDebouncedFunction;
