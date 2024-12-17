// External Libraries
import html2canvas from "html2canvas";
import { useGesture } from "@use-gesture/react";
// React and UI framework
import { useState, forwardRef, useRef, useImperativeHandle } from "react";
import { Box } from "@chakra-ui/react";
// Internal Types
import { ITextInfo } from "../../types/textEditor";
// Components and hooks
import { useCanvasDrawing } from "../../hooks/useCanvasDrawing";
import TextOverlay from "./TextOverlay";

export interface DesignCanvasRef {
  getCanvas: () => Promise<void>;
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
    // TEXT_OVERLAY
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
    // CANVAS
    const imageRef = useRef<HTMLImageElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // width of the screen
    const screenWidth = window.innerWidth;
    const CANVAS_SIZE =
      screenWidth > 500 ? Math.min(screenWidth, 600) : screenWidth - 20;

    const { canvasRef } = useCanvasDrawing({
      imageUrl,
      scale,
      position,
      canvasSize: CANVAS_SIZE,
    });

    // Separate gesture handlers for canvas and text
    useGesture(
      {
        onPinch: ({ offset: [d], event }) => {
          event.preventDefault();
          const newScale = Math.max(0.1, Math.min(3, d));
          onScaleChange(newScale);
        },
        onDrag: ({ offset: [x, y] }) => {
          setPosition({ x, y });
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
        getCanvas: async () => {
          if (!imageRef.current) return;
          try {
            // clear selected text
            await handleClearTextEditing();
            // Wait a bit for the UI to update
            await new Promise((resolve) => setTimeout(resolve, 100));

            const canvas = await html2canvas(imageRef.current, {
              useCORS: true,
              allowTaint: true,
              scale: 8, // Increase quality of the output
            });
            const base64 = canvas.toDataURL("image/png");

            // Convert base64 to blob
            const response = await fetch(base64);
            const blob = await response.blob();
            return blob;
            // return canvas;
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
        width={`${CANVAS_SIZE - 1}px`}
        height={`${CANVAS_SIZE - 1}px`}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{
            touchAction: "none",
            display: "block",
            position: "relative",
          }}
        />

        {textInfo.map((txt) => (
          <TextOverlay
            key={txt.id}
            textInfo={txt}
            onDelete={onDeleteText}
            onEdit={onEditTextInfo}
            onSelect={setSelectedTextId}
            selectedTextId={selectedTextId}
          />
        ))}
      </Box>
    );
  }
);

export default DesignCanvas;
