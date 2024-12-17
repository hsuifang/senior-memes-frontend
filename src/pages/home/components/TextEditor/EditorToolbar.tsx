import { Box } from "@chakra-ui/react";
import ItemsPicker from "./ItemsPicker";
import {
  DIRECTION_OPTIONS,
  FONT_OPTIONS,
  RAINBOW_COLORS,
} from "./TextEditorConstant";

interface ITextContent {
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  direction: string;
}

interface EditorToolbarProps {
  content: ITextContent;
  handleChange: (field: string, value: string) => void;
}

const EditorToolbar = ({ content, handleChange }: EditorToolbarProps) => (
  <Box padding={2}>
    <Box padding={2} display="flex" gap={2}>
      <ItemsPicker
        type="text"
        items={DIRECTION_OPTIONS}
        itemWidth="20%"
        selectedItem={content.direction}
        onChange={(direction) => handleChange("direction", direction)}
      />
      <ItemsPicker
        type="font"
        itemWidth="20%"
        items={FONT_OPTIONS}
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
);

export default EditorToolbar;
