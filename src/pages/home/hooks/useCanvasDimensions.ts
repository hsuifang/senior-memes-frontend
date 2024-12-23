import { useState, useEffect } from "react";

interface ImageDimensions {
  width: number;
  height: number;
}

export const useCanvasDimensions = (
  imageUrl: string,
  screenWidth: number,
  screenHeight: number
) => {
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
  });

  const BASE_CANVAS_SIZE =
    screenWidth > 500 ? Math.min(screenWidth, 600) : screenWidth - 20;
  const imageRatio = imageDimensions.height / imageDimensions.width;

  const BASE_CANVAS_SIZE_HEIGHT =
    BASE_CANVAS_SIZE * imageRatio > screenHeight
      ? screenHeight
      : BASE_CANVAS_SIZE * imageRatio;

  const CANVAS_SIZE = {
    width: BASE_CANVAS_SIZE,
    height: BASE_CANVAS_SIZE * imageRatio,
  };

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return {
    canvasSize: CANVAS_SIZE,
    baseHeight: BASE_CANVAS_SIZE_HEIGHT,
    imageDimensions,
  };
};
