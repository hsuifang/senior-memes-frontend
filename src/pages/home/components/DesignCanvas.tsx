import {
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
} from "react";
import html2canvas from "html2canvas";
import { Box, Text } from "@chakra-ui/react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css"; // Add this for default styling
import "./canvas.css";
import { ITextInfo } from "../types/textEditor";
import { DeleteIcon } from "@chakra-ui/icons";
import { useGesture } from "@use-gesture/react";

export interface DesignCanvasRef {
  downloadCanvas: () => Promise<void>;
}
interface DesignCanvasProps {
  imageUrl: string;
  textInfo: ITextInfo[];
  onTextInfoChange: (textInfo: ITextInfo | null) => void;
  onDeleteText: (id: string) => void;
  onScaleChange: (scale: number) => void;
  scale?: number;
}

const DesignCanvas = forwardRef(
  (
    {
      imageUrl,
      textInfo,
      scale = 1,
      onTextInfoChange,
      onScaleChange,
      onDeleteText,
    }: DesignCanvasProps,
    ref
  ) => {
    // Image
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [boxWidth, setBoxWidth] = useState(100);
    const [boxHeight, setBoxHeight] = useState(100);

    const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
    const CANVAS_SIZE = 300; // Fixed size for mobile

    useEffect(() => {
      const image = new window.Image();
      image.crossOrigin = "anonymous";
      image.src = imageUrl;
      image.onload = () => {
        setImageObj(image);
        drawCanvas(image, scale, position);
      };
    }, [imageUrl]);

    // Draw canvas whenever scale or position changes
    const drawCanvas = (
      image: HTMLImageElement,
      currentScale: number,
      currentPosition: { x: number; y: number }
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save current context state
      ctx.save();

      // Move to center of canvas
      // ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
      ctx.translate(Math.round(CANVAS_SIZE / 2), Math.round(CANVAS_SIZE / 2));

      // Apply scale
      ctx.scale(currentScale, currentScale);

      // Apply position (normalized by scale)
      ctx.translate(
        currentPosition.x / currentScale,
        currentPosition.y / currentScale
      );

      // Calculate dimensions to maintain aspect ratio
      const aspectRatio = image.width / image.height;
      let drawWidth = CANVAS_SIZE;
      let drawHeight = CANVAS_SIZE;

      if (aspectRatio > 1) {
        drawHeight = drawWidth / aspectRatio;
      } else {
        drawWidth = drawHeight * aspectRatio;
      }

      // Draw image centered
      ctx.drawImage(
        image,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      // Restore context state
      ctx.restore();

      // Draw text elements
      drawTextElements(ctx);
    };

    const drawTextElements = (ctx: CanvasRenderingContext2D) => {
      textInfo.forEach((txt) => {
        ctx.save();
        ctx.font = `${txt.fontSize}px monospace`;
        ctx.fillStyle = txt.color;
        ctx.fillText(txt.text, txt.x, txt.y);
        ctx.restore();
      });
    };

    // Gesture handling
    useGesture(
      {
        onPinch: ({ offset: [d], event }) => {
          event.preventDefault();
          const newScale = Math.max(0.1, Math.min(3, d));
          onScaleChange(newScale);
          if (imageObj) {
            drawCanvas(imageObj, newScale, position);
          }
        },
        onDrag: ({ offset: [x, y] }) => {
          const newPosition = { x, y };
          setPosition(newPosition);
          if (imageObj) {
            drawCanvas(imageObj, scale, newPosition);
          }
        },
      },
      {
        // @ts-expect-error
        target: canvasRef.current,
        eventOptions: { passive: false },
      }
    );

    const handleClearTextEditing = async () => {
      setSelectedTextId(null);
      onTextInfoChange(null);
    };

    useImperativeHandle(ref, () => {
      return {
        downloadCanvas: async () => {
          if (!imageRef.current) return;
          try {
            // clear selected text
            await handleClearTextEditing();
            // Wait a bit for the UI to update
            await new Promise((resolve) => setTimeout(resolve, 100));

            const canvas = await html2canvas(imageRef.current, {
              useCORS: true,
              allowTaint: true,
              scale: 2, // Increase quality of the output
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
      <Box
        ref={imageRef}
        position="relative"
        onClick={handleClearTextEditing}
        overflow="hidden"
        width="299px"
        height="299px"
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{
            touchAction: "none", // Important for gesture handling
            display: "block",
          }}
        />
        {textInfo.map((txt) => (
          <Draggable
            key={txt.id}
            defaultPosition={{ x: txt.x, y: txt.y }}
            onDrag={(_, data) => {
              const updatedText = { ...txt, x: data.x, y: data.y };
              onTextInfoChange(updatedText);
            }}
          >
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
