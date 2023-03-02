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
import React, { MouseEvent } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Line, Text } from "react-konva";

const App = () => {
  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState<any[]>([]);
  const isDrawing = React.useRef(false);
  console.log(tool)

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: KonvaEventObject<globalThis.MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point?.x, point?.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleToolChange = (toolName:string) => {
    console.log(toolName)
    setTool(toolName)
  }

  let [count, setCount] = React.useState(0);

  return (
    <div
      style={{
        // display: "flex",
        // alignItems: "center",
        // justifyContent: "center",
        height: "100vh",
      }}
    > 
    <div style={{position:'absolute',zIndex:20}}>
         <Provider theme={defaultTheme}>
      {/* <select
        value={tool}
        style={{ color: "black" }}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select> */}
      {/* <View
        borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
        // padding="size-250"
        height="size-100"
      > */}
   
        
        <TooltipTrigger>
          <ActionButton aria-label="Edit Name"     onPressStart={(e) => {handleToolChange('pen')}}>
            <Edit color="positive" />
          </ActionButton>

          <Tooltip>Pen</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton
            aria-label="Edit Name"
            onPressStart={(e) => {handleToolChange('eraser')}}
          >
            <Erase />
          </ActionButton>
          <Tooltip>Eraser</Tooltip>
        </TooltipTrigger>
      </Provider>
 

      </div>
      {/* <ColorArea defaultValue="#7f0000" /> */}
      {/* </View> */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
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
