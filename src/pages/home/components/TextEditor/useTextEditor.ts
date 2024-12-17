import { useEffect, useState } from "react";
import { ITextInfo } from "../../types/textEditor";

interface UseTextEditorProps {
  initialTextInfo: ITextInfo;
}

const useTextEditor = ({ initialTextInfo }: UseTextEditorProps) => {
  const [content, setContent] = useState({
    text: "",
    color: "",
    fontSize: 0,
    fontFamily: "",
    direction: "",
  });

  const handleChange = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!content.text) {
      setContent({
        text: initialTextInfo.text,
        color: initialTextInfo.color,
        fontSize: initialTextInfo.fontSize,
        fontFamily: initialTextInfo.fontFamily || "",
        direction: initialTextInfo.direction || "",
      });
    }
  }, [initialTextInfo]);

  return { content, handleChange };
};

export default useTextEditor;
