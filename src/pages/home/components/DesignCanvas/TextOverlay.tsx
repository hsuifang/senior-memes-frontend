import { Box, Text } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import Draggable from "react-draggable";
import { ITextInfo } from "../../types/textEditor";

interface TextOverlayProps {
  textInfo: ITextInfo;
  selectedTextId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onEdit: (textInfo: ITextInfo | null) => void;
}

const TextOverlay = ({
  textInfo: txt,
  onDelete,
  onEdit,
  onSelect,
  selectedTextId,
}: TextOverlayProps) => {
  const handleClearTextEditing = async () => {
    onEdit(null);
    onSelect(null);
  };

  return (
    <Draggable
      key={txt.id}
      onStop={(e) => {
        if (e.type === "touchend") {
          onSelect(txt.id);
        }
      }}
      bounds="parent"
      enableUserSelectHack={false}
      cancel=".icon-container"
    >
      <Box
        position="absolute"
        border={selectedTextId === txt.id ? "2px dashed red" : "none"}
        top={txt.y}
        left={txt.x}
        pointerEvents="auto"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(txt.id);
        }}
        style={{
          touchAction: "manipulation", // Prevents touch events from interfering
          userSelect: "none", // Prevents text selection
        }}
      >
        <Text
          style={{
            WebkitTextStroke: 1,
            WebkitTextStrokeColor: "grey",
            touchAction: "manipulation",
            writingMode:
              txt.direction === "vertical" ? "vertical-rl" : "horizontal-tb",
          }}
          color={txt.color}
          fontSize={txt.fontSize}
          fontFamily={txt.fontFamily}
          fontWeight="bold"
          letterSpacing={1}
          userSelect="none"
        >
          {txt.text}
        </Text>
        <Box className="icon-container">
          {selectedTextId === txt.id && (
            <Box width="100%" display="flex" gap={2} zIndex="3">
              <DeleteIcon
                backgroundColor="rgba(0,0,0, 0.3)"
                color="white"
                position="absolute"
                top="-18px"
                left="-12px"
                borderRadius="50%"
                padding={2}
                cursor="pointer"
                fontSize="30px"
                shadow="md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearTextEditing();
                  onDelete(txt.id);
                }}
              />
              <EditIcon
                position="absolute"
                top="-18px"
                right="-12px"
                backgroundColor="rgba(0,0,0, 0.3)"
                color="white"
                borderRadius="50%"
                padding={2}
                cursor="pointer"
                fontSize="30px"
                shadow="md"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(txt);
                  onSelect(null);
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Draggable>
  );
};

export default TextOverlay;
