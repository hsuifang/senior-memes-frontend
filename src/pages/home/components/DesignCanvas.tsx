import { useState, useEffect } from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; // Add this for default styling
import "./canvas.css";
import { ITextInfo } from "../types/textEditor";

const DesignCanvas = ({
  imageUrl,
  textInfo,
  onTextInfoChange,
}: {
  imageUrl: string;
  textInfo: ITextInfo[];
  onTextInfoChange: (textInfo: ITextInfo | null) => void;
}) => {
  const [boxWidth, setBoxWidth] = useState(300);
  const [boxHeight, setBoxHeight] = useState(100); // Default width of the text box

  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const handleOutsideClick = (e: React.MouseEvent) => {
    console.log(e.target, e.currentTarget);
    setSelectedTextId(null);
    onTextInfoChange(null);
  };

  return (
    <Box position="relative" onClick={handleOutsideClick}>
      <Box border="3px dashed #ccc" padding={2}>
        <Image src={imageUrl} alt="meme" width={500} />
      </Box>
      {textInfo.map((txt) => (
        <Draggable key={txt.id} defaultPosition={{ x: txt.x, y: txt.y }}>
          <ResizableBox
            width={boxWidth}
            height={boxHeight}
            axis="both" // Allow resizing only horizontally
            resizeHandles={["w"]} // Resize handles on East and West
            onResizeStop={(_, data) => {
              setBoxWidth(data.size.width);
              setBoxHeight(data.size.height);
            }} // Update width on resize
            minConstraints={[100, txt.fontSize + 20]} // Minimum width
            maxConstraints={[400, txt.fontSize + 20]} // Maximum width
          >
            <Box
              border={selectedTextId === txt.id ? "2px dashed red" : "none"}
              padding={2}
              backgroundColor="rgba(white, 0.2)"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTextId(txt.id);
                onTextInfoChange(txt);
              }}
            >
              <Text
                // style={{ WebkitTextStroke: 1, WebkitTextStrokeColor: "grey" }}
                color={txt.color}
                fontSize={txt.fontSize}
              >
                {txt.text}
              </Text>
            </Box>
          </ResizableBox>
        </Draggable>
      ))}
    </Box>
  );
  // has a image and has two text on image
  // set image width default 500px
  // set text default "Hello"
};

export default DesignCanvas;
