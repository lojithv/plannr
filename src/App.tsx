import {
  TooltipTrigger,
  ActionButton,
  Tooltip,
  View,
  ProgressBar,
  Flex,
  Provider,
  defaultTheme,
  Button,
} from "@adobe/react-spectrum";
import Edit from "@spectrum-icons/workflow/Edit";
import Erase from "@spectrum-icons/workflow/Erase";
import { KonvaEventObject } from "konva/lib/Node";
import React, { MouseEvent, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Line, Text, Rect, Circle, Group } from "react-konva";

const App = () => {
  const [tool, setTool] = React.useState("pen");
  const [isDrawing, setIsDrawing] = useState(false);

  const handleToolChange = (toolName: string) => {
    console.log(toolName);
    if (toolName === "pan") {
      setIsDrawing(false);
    }
    setTool(toolName);
  };

  const [lines, setLines] = useState<any[]>([]);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  // const groupRef = useRef<any>(null);

  const handleMouseDown = () => {
    setIsDrawing(true);
    const pos = layerRef.current.getRelativePointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = () => {
    if (!isDrawing && (tool === "pen" || tool === "eraser")) {
      return;
    }

    const point = layerRef.current.getRelativePointerPosition();
    let lastLine = lines[lines.length - 1];
    if (lastLine) {
      // add point
      lastLine.points = lastLine.points.concat([point.x, point.y]);

      // replace last
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    const oldScale = scale;
    const pointer = stage.getPointerPosition();

    let zoomAmount = e.evt.deltaY > 0 ? 1.1 : 1 / 1.1;
    let newScale = oldScale * zoomAmount;

    setScale(newScale);

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newZoom = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newZoom);
    stage.batchDraw();
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        backgroundColor: "black",
      }}
    >
      <div style={{ position: "absolute", zIndex: 20 }}>
        <Provider theme={defaultTheme}>
          <Flex wrap gap="size-250">
            <View backgroundColor="static-blue-700" padding="size-50">
              <TooltipTrigger>
                <ActionButton
                  aria-label="Edit Name"
                  onPressStart={(e) => {
                    handleToolChange("pan");
                  }}
                >
                  <Edit color="positive" />
                </ActionButton>

                <Tooltip>Pen</Tooltip>
              </TooltipTrigger>
              <TooltipTrigger>
                <ActionButton
                  aria-label="Edit Name"
                  onPressStart={(e) => {
                    handleToolChange("pen");
                  }}
                >
                  <Edit color="positive" />
                </ActionButton>

                <Tooltip>Pen</Tooltip>
              </TooltipTrigger>
              <TooltipTrigger>
                <ActionButton
                  aria-label="Edit Name"
                  onPressStart={(e) => {
                    handleToolChange("eraser");
                  }}
                >
                  <Erase />
                </ActionButton>
                <Tooltip>Eraser</Tooltip>
              </TooltipTrigger>
            </View>
          </Flex>
          {/* <ColorArea defaultValue="#7f0000" /> */}
        </Provider>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onWheel={handleWheel}
        ref={stageRef}
        scaleX={scale}
        scaleY={scale}
        className="stage"
      >
        <Layer
          ref={layerRef}
          width={window.innerWidth}
          height={window.innerHeight}
        >
          <Rect
            x={50}
            y={50}
            width={100}
            height={100}
            fill="red"
            draggable={true}
          />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={line.tool === "eraser" ? 20:5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
