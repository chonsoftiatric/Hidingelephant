import React, { useEffect } from "react";
import { ControlButton, useReactFlow, Panel } from "reactflow";
import {
  FaLock,
  FaLockOpen,
  FaPlus,
  FaMinus,
  FaExpandArrowsAlt,
} from "react-icons/fa";

type Props = {
  isLocked: boolean;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
};
const CustomControls = ({ isLocked, setIsLocked }: Props) => {
  const { zoomIn, zoomOut, fitView, viewportInitialized } = useReactFlow();

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      const isBody = event.target.localName === "body";
      if (!isBody) return;

      switch (event.key.toLowerCase()) {
        case "l":
          setIsLocked((prev) => !prev);
          break;
        case "f":
          fitView();
          break;
        case "+":
          zoomIn();
          break;
        default:
          break;
      }
      // Handle '-' key separately
      if (event.key === "-" || event.keyCode === 189) {
        zoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [viewportInitialized]);

  const handleLockClick = () => {
    setIsLocked((prev) => !prev);
  };

  return (
    <Panel position="bottom-left">
      <div className="react-flow__controls">
        <ControlButton onClick={() => zoomIn()} title="zoom in">
          <FaPlus />
        </ControlButton>
        <ControlButton
          onClick={() => {
            zoomOut();
          }}
          title="zoom out"
        >
          <FaMinus />
        </ControlButton>
        <ControlButton onClick={() => fitView()} title="fit view">
          <FaExpandArrowsAlt />
        </ControlButton>
        <ControlButton
          onClick={handleLockClick}
          title={isLocked ? "Unlock" : "Lock"}
        >
          {isLocked ? <FaLock /> : <FaLockOpen />}
        </ControlButton>
      </div>
    </Panel>
  );
};
export default CustomControls;
