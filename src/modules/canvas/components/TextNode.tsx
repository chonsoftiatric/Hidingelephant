import React, { useState, useCallback, useRef, useEffect } from "react";
import { Handle, NodeProps, Position, NodeResizer } from "reactflow";
import useCanvasNodes from "@/hooks/useCanvasNodes";

export type TextNodeData = {
  text: string;
  width: number;
  height: number;
};

export type TextNodeProps = NodeProps<TextNodeData>;

const TextNode = ({ data, id }: TextNodeProps) => {
  const { handleNodeTextChange } = useCanvasNodes();
  const [text, setText] = useState(data.text);
  const [dimensions, setDimensions] = useState({
    width: data.width || 200,
    height: data.height || 100,
  });
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const aspectRatio = useRef(data.width / data.height);

  const handleChange = useCallback(
    (val: string) => {
      setText(val);
      handleNodeTextChange({
        nodeId: id,
        data: {
          ...data,
          text: val,
        },
      });
    },
    [id, data, handleNodeTextChange]
  );

  const onResize = useCallback(
    (_: any, newSize: any) => {
      const newHeight = newSize.width / aspectRatio.current;
      setDimensions({ width: newSize.width, height: newHeight });
      handleNodeTextChange({
        nodeId: id,
        data: {
          ...data,
          width: newSize.width,
          height: newHeight,
        },
      });
    },
    [id, data, handleNodeTextChange]
  );

  useEffect(() => {
    if (inputRef.current) {
      const newWidth = Math.max(dimensions.width, inputRef.current.scrollWidth);
      if (newWidth !== dimensions.width) {
        const newHeight = newWidth / aspectRatio.current;
        setDimensions({ width: newWidth, height: newHeight });
        handleNodeTextChange({
          nodeId: id,
          data: {
            ...data,
            width: newWidth,
            height: newHeight,
          },
        });
      }
    }
  }, [text, dimensions.width, id, data, handleNodeTextChange]);

  return (
    <div
      style={{ width: dimensions.width, height: dimensions.height }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NodeResizer
        minWidth={100}
        minHeight={100 / aspectRatio.current}
        isVisible={isHovered}
        onResize={onResize}
        keepAspectRatio={true}
      />
      <input
        ref={inputRef}
        className="all-unset outline-none w-full h-full text-center bg-transparent"
        style={{
          fontSize: `${Math.max(12, Math.min(32, dimensions.height / 4))}px`,
        }}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default TextNode;
