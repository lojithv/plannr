import { ColorArea, ColorSlider } from "@react-spectrum/color";
import { Flex } from "@react-spectrum/layout";
import { Label } from "@react-spectrum/label";
import { parseColor } from "@react-stately/color";
import React from "react";
import { ToolStateStore } from "../store/Tools";
import { Color } from "@react-types/color";

function ColorPicker() {
  let [color, setColor] = React.useState(parseColor("#ff00ff"));
  let [redChannel, greenChannel, blueChannel] = color.getColorChannels();

  const handleColorChangeEnd = (c: Color) => {
    console.log(c.toString("css"));
    ToolStateStore.setColor(c.toString("css"));
  };

  return (
    <fieldset style={{ border: 0 }}>
      <legend>{color.getColorSpace().toUpperCase()}A Example</legend>
      <Flex direction="column">
        <ColorArea
          xChannel={redChannel}
          yChannel={greenChannel}
          value={color}
          onChange={setColor}
          onChangeEnd={handleColorChangeEnd}
        />
        <ColorSlider
          channel={blueChannel}
          value={color}
          onChange={setColor}
          onChangeEnd={handleColorChangeEnd}
        />
        <ColorSlider
          channel="alpha"
          value={color}
          onChange={setColor}
          onChangeEnd={handleColorChangeEnd}
        />
        <p>Current value: {color.toString("css")}</p>
      </Flex>
    </fieldset>
  );
}

export default ColorPicker;
