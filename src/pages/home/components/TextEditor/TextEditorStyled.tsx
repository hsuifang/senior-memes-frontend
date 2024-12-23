import { Box, Input } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const StyledEditorOverlay = styled(Box)`
  width: 100%;
  height: ${(props) => props.height + "px"};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
`;

export const StyledEditorContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 1rem 3rem 1rem;
`;

export const StyledActionBar = styled(Box)`
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 8px;

  button {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const StyledTextInputBox = styled(Input)<{ $fontSize: number }>`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -60%);
  background-color: white;
  text-align: center;
  font-weight: 700;
  border: none;
  width: ${({ width = 300 }) => width + "px"};
  padding: 8px;
  z-index: 2;
  -webkit-text-stroke: 1;
  -webkit-text-stroke-color: grey;
  height: ${({ $fontSize }) => ($fontSize > 40 ? $fontSize + "px" : "40px")};
`;
