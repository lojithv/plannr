import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";

const DrawingCanvas = () => {
  const [lines, setLines] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDrawing(false);
    };

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = () => {
    setIsDrawing(true);
    setLines([...lines, []]);
  };

  const handleMouseMove = () => {
    if (!isDrawing) {
      return;
    }

    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine = lastLine.concat([point.x, point.y]);

    setLines([...lines.slice(0, lines.length - 1), lastLine]);
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      ref={stageRef}
      draggable={!isDrawing}
      scaleX={1}
      scaleY={1}
    >
      <Layer>
        {lines.map((line, i) => (
          <Line key={i} points={line} stroke="red" strokeWidth={5} />
        ))}
      </Layer>
    </Stage>
  );
};

export default DrawingCanvas;
