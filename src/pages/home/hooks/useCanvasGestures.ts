import { useGesture } from "@use-gesture/react";

export const useCanvasGestures = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  onScaleChange: (scale: number) => void,
  setPosition: (position: { x: number; y: number }) => void
) => {
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
};
