import styled from "@emotion/styled";
import { Box, Button } from "@chakra-ui/react";

const ControlContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 1rem;
  width: 100%;
`;

const AddTextButton = styled(Button)`
  width: 70%;
`;

const GenerateButton = styled(Button)`
  width: 28%;
`;

interface ControlPanelProps {
  handleAddText: () => void;
  handleUploadImage: () => void;
  canAddMoreText: boolean;
  canGenerateImage: boolean;
}

const ControlPanel = ({
  handleAddText,
  handleUploadImage,
  canAddMoreText,
  canGenerateImage,
}: ControlPanelProps) => {
  return (
    <ControlContainer>
      <AddTextButton
        variant="outline"
        onClick={handleAddText}
        colorScheme="blue"
        disabled={!canAddMoreText}
      >
        添加文字
      </AddTextButton>
      <GenerateButton
        onClick={handleUploadImage}
        variant="outline"
        colorScheme="orange"
        fontWeight="bold"
        disabled={!canGenerateImage}
      >
        產生圖片
      </GenerateButton>
    </ControlContainer>
  );
};

export default ControlPanel;
