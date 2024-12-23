import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLiffStore } from "@/store/useLiffStore";
import { getImage, saveImage } from "../service/api";
import { ITextInfo } from "../types/textEditor";
import liff from "@line/liff";
import { DesignCanvasRef } from "../components/DesignCanvas/DesignCanvas";

const useHomeLogic = () => {
  // All states
  const [searchParams] = useSearchParams();
  const imageId = searchParams.get("imageId");
  const { getIDToken, idToken } = useLiffStore();
  const [isLoading, setIsLoading] = useState(false);
  const [editTextInfo, setEditTextInfo] = useState<ITextInfo | null>(null);
  const [userTextInfo, setUserTextInfo] = useState<ITextInfo[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const designCanvasRef = useRef<DesignCanvasRef>(null);

  // Text handling methods
  const handleAddText = () => {
    const newText: ITextInfo = {
      id: Date.now().toString(),
      text: `新文字${Date.now().toString().slice(5, 8)}`,
      x: 0,
      y: 0,
      fontSize: 40,
      color: "black",
      direction: "horizontal",
      fontFamily: "girl",
    };
    setUserTextInfo((prev) => [...prev, newText]);
  };

  const handleTextInfoChange = (textInfo: ITextInfo | null) => {
    if (textInfo === null) {
      setEditTextInfo(null);
      return;
    }
    setUserTextInfo((prev) =>
      prev.map((txt) => (txt.id === textInfo.id ? textInfo : txt))
    );
    setEditTextInfo(textInfo);
  };

  const handleDeleteText = (id: string) => {
    setUserTextInfo((prev) => prev.filter((txt) => txt.id !== id));
    setEditTextInfo(null);
  };

  // Image handling methods
  const handleUploadImage = async () => {
    setIsLoading(true);
    try {
      const imageBlob = await designCanvasRef.current?.getCanvas();

      if (imageBlob && idToken && imageId) {
        await saveImage(imageBlob, idToken, imageId);
        await liff.sendMessages([
          {
            type: "text",
            text: "長輩圖製作完成！",
          },
        ]);
        liff.closeWindow();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    const imageBlob = await designCanvasRef.current?.getCanvas();
    if (imageBlob && idToken && imageId) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(imageBlob);
      a.download = "image.png";
      a.click();
    }
  };

  const fetchMemeImage = async (imageId: string) => {
    if (!idToken) return;
    try {
      const response = await getImage(imageId, idToken);
      const blob = new Blob([response], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  // Scale handling
  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
  };

  // Effects
  useEffect(() => {
    if (imageId && idToken) {
      fetchMemeImage(imageId);
    }
  }, [imageId, idToken]);

  useEffect(() => {
    getIDToken();
    // Cleanup function to revoke object URLs
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, []);

  return {
    // States
    isLoading,
    imageUrl,
    userTextInfo,
    editTextInfo,
    scale,
    designCanvasRef,

    // Methods
    handleAddText,
    handleUploadImage,
    handleTextInfoChange,
    handleDeleteText,
    handleScaleChange,
    setEditTextInfo,
    handleDownloadImage,
    // Computed values
    canAddMoreText: userTextInfo.length < 10,
    canGenerateImage: userTextInfo.length > 0,
    defaultImageUrl: "https://placehold.co/600x400/EEE/31343C",
  };
};

export default useHomeLogic;
