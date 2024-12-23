// React and UI framework
import { useState, forwardRef, useRef, useImperativeHandle } from "react";
import { Box } from "@chakra-ui/react";
// Internal Types
import { ITextInfo } from "../../types/textEditor";
// Components and hooks
import { useCanvasDrawing } from "../../hooks/useCanvasDrawing";
import { useScreenshot } from "../../hooks/useScreenshot";
import { useCanvasDimensions } from "../../hooks/useCanvasDimensions";
import { useCanvasGestures } from "../../hooks/useCanvasGestures";
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
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // custom Hooks
    const { captureCanvas } = useScreenshot(imageRef);
    const { canvasSize, baseHeight } = useCanvasDimensions(
      imageUrl,
      window.innerWidth,
      window.innerHeight * 0.8
    );
    const { canvasRef } = useCanvasDrawing({
      imageUrl,
      scale,
      position,
      canvasSize,
    });

    useCanvasGestures(canvasRef, onScaleChange, setPosition);

    const handleClearTextEditing = async () => {
      onEditTextInfo(null);
      setSelectedTextId(null);
    };

    useImperativeHandle(ref, () => {
      return {
        getCanvas: async () => {
          // clear selected text
          await handleClearTextEditing();
          // Wait a bit for the UI to update
          await new Promise((resolve) => setTimeout(resolve, 100));
          return captureCanvas();
        },
      };
    });

    return (
      <Box
        ref={imageRef}
        position="relative"
        onClick={handleClearTextEditing}
        overflow="hidden"
        width={`${canvasSize.width - 1}px`}
        height={`${baseHeight - 1}px`}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
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
