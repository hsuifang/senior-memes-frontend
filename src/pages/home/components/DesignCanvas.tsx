import {
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { DraggableEvent, DraggableData } from "react-draggable"; // Add this import
import html2canvas from "html2canvas";
import { Box, Button, Text } from "@chakra-ui/react";
import Draggable from "react-draggable";
import "react-resizable/css/styles.css"; // Add this for default styling
import "./canvas.css";
import { ITextInfo } from "../types/textEditor";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useGesture } from "@use-gesture/react";

export interface DesignCanvasRef {
  downloadCanvas: () => Promise<void>;
}
interface DesignCanvasProps {
  imageUrl: string;
  textInfo: ITextInfo[];
  onEditTextInfo: (textInfo: ITextInfo | null) => void;
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
      onEditTextInfo,
      onScaleChange,
      onDeleteText,
    }: DesignCanvasProps,
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

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
    };

    // Separate gesture handlers for canvas and text
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
      onEditTextInfo(null);
      setSelectedTextId(null);
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

    const [dragPosition, setDragPosition] = useState<{
      [key: string]: { x: number; y: number };
    }>({});

    const handleDrag = (id: string, e: DraggableEvent, data: DraggableData) => {
      setDragPosition((prev) => ({
        ...prev,
        [id]: { x: data.x, y: data.y },
      }));
    };

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
            touchAction: "none",
            display: "block",
          }}
        />

        {textInfo.map((txt) => (
          <Draggable
            key={txt.id}
            onStop={(e) => {
              if (e.type === "touchend") {
                setSelectedTextId(txt.id);
              }
            }}
            bounds="parent"
            enableUserSelectHack={false}
            cancel=".icon-container"
          >
            <Box
              position="absolute"
              border={selectedTextId === txt.id ? "2px dashed red" : "none"}
              top={txt.y}
              left={txt.x}
              pointerEvents="auto"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTextId(txt.id);
              }}
              style={{
                touchAction: "manipulation", // Prevents touch events from interfering
                userSelect: "none", // Prevents text selection
              }}
            >
              <Text
                style={{
                  WebkitTextStroke: 1,
                  WebkitTextStrokeColor: "grey",
                  touchAction: "manipulation", // Changed from 'none'
                  writingMode:
                    txt.direction === "vertical"
                      ? "vertical-rl"
                      : "horizontal-tb",
                }}
                color={txt.color}
                fontSize={txt.fontSize}
                fontFamily={txt.fontFamily}
                fontWeight="bold"
                letterSpacing={1}
                userSelect="none"
              >
                {txt.text}
              </Text>
              <Box className="icon-container">
                {selectedTextId === txt.id && (
                  <Box width="100%" display="flex" gap={2} zIndex="3">
                    <DeleteIcon
                      backgroundColor="rgba(0,0,0, 0.3)"
                      color="white"
                      position="absolute"
                      top="-18px"
                      left="-12px"
                      borderRadius="50%"
                      padding={2}
                      cursor="pointer"
                      fontSize="30px"
                      shadow="md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearTextEditing();
                        onDeleteText(txt.id);
                      }}
                    />
                    <EditIcon
                      position="absolute"
                      top="-18px"
                      right="-12px"
                      backgroundColor="rgba(0,0,0, 0.3)"
                      color="white"
                      borderRadius="50%"
                      padding={2}
                      cursor="pointer"
                      fontSize="30px"
                      shadow="md"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTextInfo(txt);
                        setSelectedTextId(null);
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Draggable>
        ))}
      </Box>
    );
  }
);

export default DesignCanvas;
