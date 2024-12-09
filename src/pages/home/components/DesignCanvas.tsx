import { useState, forwardRef, useRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; // Add this for default styling
import "./canvas.css";
import { ITextInfo } from "../types/textEditor";
import { DeleteIcon } from "@chakra-ui/icons";
export interface DesignCanvasRef {
  downloadCanvas: () => Promise<void>;
}
const DesignCanvas = forwardRef(
  (
    {
      imageUrl,
      textInfo,
      onTextInfoChange,
      onDeleteText,
    }: {
      imageUrl: string;
      textInfo: ITextInfo[];
      onTextInfoChange: (textInfo: ITextInfo | null) => void;
      onDeleteText: (id: string) => void;
    },
    ref
  ) => {
    // Image
    const imageRef = useRef<HTMLImageElement>(null);
    const [boxWidth, setBoxWidth] = useState(300);
    const [boxHeight, setBoxHeight] = useState(100);

    const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

    const handleClearTextEditing = async () => {
      setSelectedTextId(null);
      onTextInfoChange(null);
    };

    const canvasRef = useRef(null);

    useImperativeHandle(ref, () => {
      return {
        downloadCanvas: async () => {
          if (!canvasRef.current) return;
          try {
            // clear selected text
            await handleClearTextEditing();
            const canvas = await html2canvas(canvasRef.current, {
              useCORS: true,
              allowTaint: true,
            });
            const link = document.createElement("a");
            link.download = `meme-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
          } catch (error) {
            console.error(error);
          }
        },
      };
    });

    return (
      <Box ref={canvasRef} position="relative" onClick={handleClearTextEditing}>
        <Box width={500}>
          <Image ref={imageRef} src={imageUrl} alt="meme" width="100%" />
        </Box>
        {textInfo.map((txt) => (
          <Draggable key={txt.id} defaultPosition={{ x: txt.x, y: txt.y }}>
            {/* BUG: 每一個 TEXT 的寬度是獨立的 */}
            <ResizableBox
              width={boxWidth}
              height={boxHeight}
              axis="both" // Allow resizing only horizontally
              resizeHandles={["w", "e"]} // Resize handles on East and West
              onResizeStop={(_, data) => {
                setBoxWidth(data.size.width);
                setBoxHeight(data.size.height);
              }}
              minConstraints={[40, txt.fontSize + 20]} // Minimum width
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
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing={1}
                >
                  {txt.text}
                </Text>
                {selectedTextId === txt.id && (
                  <DeleteIcon
                    position="absolute"
                    top="-10px"
                    right="-10px"
                    backgroundColor="white"
                    borderRadius="50%"
                    padding={3}
                    cursor="pointer"
                    fontSize="40px"
                    shadow="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearTextEditing();
                      onDeleteText(txt.id);
                    }}
                  />
                )}
              </Box>
            </ResizableBox>
          </Draggable>
        ))}
      </Box>
    );
  }
);

export default DesignCanvas;
