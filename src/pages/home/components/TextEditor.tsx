import { Input, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ItemsPicker from "./ItemsPicker";
import { ITextInfo } from "../types/textEditor";

const RAINBOW_COLORS = [
  { val: "#000000", label: "Black" },
  { val: "#FF334C", label: "Red" },
  { val: "#FE7036", label: "Orange" },
  { val: "#FCB222", label: "Yellow" },
  { val: "#71DF55", label: "Green" },
  { val: "#18BD66", label: "Blue" },
  { val: "#4B0082", label: "Indigo" },
  { val: "#4645D1", label: "Violet" },
  { val: "#8556E6", label: "Pink" },
  { val: "#A771C9", label: "Brown" },
  { val: "#808080", label: "Gray" },
];

const VerticalSlider = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const position = ((value - 12) / (40 - 12)) * 100; // converts value to percentage
  return (
    <Box
      height="130px"
      width="40px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        position="absolute"
        right="30px"
        top={`${100 - position}%`} // Inverted percentage because slider is rotated
        transform="translateY(-50%)"
        color="white"
        fontSize="14px"
        fontWeight="bold"
        backgroundColor="rgba(0, 0, 0, 0.5)"
        borderRadius="4px"
        padding="2px 6px"
        transition="top 0.1s ease"
      >
        {value}
      </Box>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min="12"
        max="40"
        style={{
          width: "200px",
          transform: "rotate(-90deg)",
          WebkitAppearance: "none",
          background: "rgba(255, 255, 255, 0.3)",
          height: "4px",
          borderRadius: "2px",
          cursor: "pointer",
          appearance: "none",
          outline: "none",
        }}
      />
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #ff334c; /* Change this to your desired color */
          border-radius: 50%;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #ff334c; /* Change this to your desired color */
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </Box>
  );
};

const TextEditor = ({
  textInfo,
  onFinish,
  onCancel,
}: {
  textInfo: ITextInfo;
  onFinish: (textInfo: ITextInfo | null) => void;
  onCancel: () => void;
}) => {
  const [content, setContent] = useState({
    text: "",
    color: "",
    fontSize: 0,
    fontFamily: "",
    direction: "",
  });

  // onChange
  // send textInfo to parent
  const handleChange = (key: string, value: string) => {
    setContent((pre) => ({ ...pre, [key]: value }));
  };

  const updatedEdit = () => {
    onFinish({ ...textInfo, ...content });
  };

  useEffect(() => {
    if (!content.text) {
      setContent({
        text: textInfo.text,
        color: textInfo.color,
        fontSize: textInfo.fontSize,
        fontFamily: textInfo.fontFamily || "",
        direction: textInfo.direction || "",
      });
    }
  }, [textInfo]);

  return (
    <Box
      pos="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bgColor="rgba(0,0,0, 0.6)"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        <Box color="white" display="flex" justifyContent="space-between" p={2}>
          <Box as="p" onClick={onCancel}>
            取消
          </Box>
          <Box as="p" onClick={updatedEdit}>
            儲存
          </Box>
        </Box>

        <Box
          position="absolute"
          right="10px"
          bottom="5%"
          transform="translateY(-50%)"
        >
          <VerticalSlider
            value={content.fontSize}
            onChange={(size) => handleChange("fontSize", size.toString())}
          />
        </Box>
        <Box padding={2}>
          <Box padding={2} display="flex" gap={2}>
            <ItemsPicker
              type="text"
              items={[
                { val: "vertical", label: "直" },
                { val: "horizontal", label: "橫" },
              ]}
              itemWidth="20%"
              selectedItem={content.direction}
              onChange={(direction) => handleChange("direction", direction)}
            />

            <ItemsPicker
              type="font"
              itemWidth="20%"
              items={[
                { val: "girl", label: "字" },
                { val: "monospace", label: "字" },
              ]}
              selectedItem={content.fontFamily}
              onChange={(font) => handleChange("fontFamily", font)}
            />
          </Box>
          <ItemsPicker
            type="color"
            itemWidth="12%"
            items={RAINBOW_COLORS}
            selectedItem={content.color}
            onChange={(color) => handleChange("color", color)}
          />
        </Box>

        <Box
          pos="absolute"
          data-testid="targetTextBox"
          top="40%"
          left="50%"
          transform="translate(-50%, -60%)"
          bgColor="rgba(0, 0,0, 0.2)"
          zIndex="2"
        >
          <Input
            // autoFocus
            textAlign="center"
            backgroundColor="white"
            value={content.text}
            onChange={(e) => handleChange("text", e.target.value)}
            color={content.color}
            fontSize={content.fontSize}
            fontFamily={content.fontFamily}
            fontWeight="700"
            border="none"
            width="300px"
            padding={2}
            maxLength={20}
            style={{
              WebkitTextStroke: 1,
              WebkitTextStrokeColor: "grey",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TextEditor;
