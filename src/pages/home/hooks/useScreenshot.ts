import html2canvas from "html2canvas";

export const useScreenshot = (imageRef: React.RefObject<HTMLElement>) => {
  const captureCanvas = async () => {
    if (!imageRef.current) return;

    try {
      const canvas = await html2canvas(imageRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 8,
      });
      const base64 = canvas.toDataURL("image/png");
      const response = await fetch(base64);
      return await response.blob();
    } catch (error) {
      return null;
    }
  };

  return { captureCanvas };
};
