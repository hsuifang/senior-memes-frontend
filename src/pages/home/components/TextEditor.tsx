import {
  Text,
  Card,
  Input,
  CardBody,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { ITextInfo } from "../types/textEditor";

const TextEditor = ({
  textInfo,
  onChange,
}: {
  textInfo: ITextInfo;
  onChange: (textInfo: ITextInfo | null) => void;
}) => {
  // onChange
  // send textInfo to parent
  const handleChange = (key: string, value: string) => {
    onChange({ ...textInfo, [key]: value });
  };

  return (
    <Card>
      {/* color */}
      <CardBody display="flex">
        <Box padding={1} w="20%">
          <Input
            type="color"
            data-testid="color-input"
            value={textInfo.color}
            name="color"
            onChange={(e) => handleChange("color", e.target.value)}
          />
        </Box>
        <Box padding={1} w="20%">
          <NumberInput
            onChange={(size) => handleChange("fontSize", size)}
            name="fontsize"
            value={textInfo.fontSize}
            min={12}
            max={50}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
        {/* value */}
        <Box padding={1} w="60%">
          <Input
            name="text"
            type="text"
            maxLength={30}
            value={textInfo.text}
            onChange={(e) => handleChange("text", e.target.value)}
          />
        </Box>
      </CardBody>
    </Card>
  );
};

export default TextEditor;
