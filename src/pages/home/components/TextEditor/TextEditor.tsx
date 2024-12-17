import { Box } from "@chakra-ui/react";
import { ITextInfo } from "../../types/textEditor";
import Slider from "../Slider/Slider";
import EditorToolbar from "./EditorToolbar";
import useTextEditor from "./useTextEditor";
import {
  StyledEditorContainer,
  StyledEditorOverlay,
  StyledActionBar,
  StyledTextInputBox,
} from "./TextEditorStyled";

interface TextEditorProps {
  textInfo: ITextInfo;
  onFinish: (textInfo: ITextInfo | null) => void;
  onCancel: () => void;
}
interface ActionBarProps {
  onCancel: () => void;
  onSave: () => void;
}

const ActionBar = ({ onCancel, onSave }: ActionBarProps) => (
  <StyledActionBar>
    <Box as="button" onClick={onCancel}>
      取消
    </Box>
    <Box as="button" onClick={onSave}>
      儲存
    </Box>
  </StyledActionBar>
);

const TextEditor = ({ textInfo, onFinish, onCancel }: TextEditorProps) => {
  const screenWidth = window.innerWidth;
  const TextWidth =
    screenWidth > 500 ? Math.min(screenWidth, 520) : screenWidth - 20;

  const { content, handleChange } = useTextEditor({
    initialTextInfo: textInfo,
  });

  const updatedEdit = () => {
    onFinish({ ...textInfo, ...content });
  };

  return (
    <StyledEditorOverlay>
      <StyledEditorContainer>
        <ActionBar onCancel={onCancel} onSave={updatedEdit} />

        <Box
          position="absolute"
          right="10px"
          bottom="5%"
          transform="translateY(-50%)"
        >
          <Slider
            value={content.fontSize}
            onChange={(size) => handleChange("fontSize", size.toString())}
            min={12}
            max={70}
          />
        </Box>

        <EditorToolbar content={content} handleChange={handleChange} />

        <StyledTextInputBox
          // autoFocus
          value={content.text}
          onChange={(e) => handleChange("text", e.target.value)}
          color={content.color}
          $fontSize={content.fontSize}
          fontSize={content.fontSize}
          fontFamily={content.fontFamily}
          width={TextWidth}
          maxLength={20}
          onClick={(e) => e.stopPropagation()}
        />
      </StyledEditorContainer>
    </StyledEditorOverlay>
  );
};

export default TextEditor;
