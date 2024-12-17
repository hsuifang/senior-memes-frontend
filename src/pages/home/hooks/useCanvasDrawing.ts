import { useEffect, useRef, useState } from "react";

interface UseCanvasDrawingProps {
  imageUrl: string;
  scale: number;
  position: { x: number; y: number };
  canvasSize: number;
}

export const useCanvasDrawing = ({
  imageUrl,
  scale,
  position,
  canvasSize,
}: UseCanvasDrawingProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

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
    ctx.translate(Math.round(canvasSize / 2), Math.round(canvasSize / 2));

    // Apply scale
    ctx.scale(currentScale, currentScale);

    // Apply position (normalized by scale)
    ctx.translate(
      currentPosition.x / currentScale,
      currentPosition.y / currentScale
    );

    // Calculate dimensions to maintain aspect ratio
    const aspectRatio = image.width / image.height;
    let drawWidth = canvasSize;
    let drawHeight = canvasSize;

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

  useEffect(() => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
    image.onload = () => {
      setImageObj(image);
      drawCanvas(image, scale, position);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (imageObj) {
      drawCanvas(imageObj, scale, position);
    }
  }, [scale, position, imageObj]);

  return { canvasRef };
};