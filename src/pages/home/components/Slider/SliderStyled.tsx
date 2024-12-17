import styled from "@emotion/styled";
import { Box } from "@chakra-ui/react";

export const SliderContainer = styled(Box)<{ width?: string; height?: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ValueLabel = styled(Box)<{ $top: string }>`
  position: absolute;
  right: 30px;
  top: ${(props) => props.$top};
  transform: translateY(-50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  padding: 2px 6px;
  transition: top 0.1s ease;
`;

export const RangeInput = styled.input<{
  $color: string;
  $trackColor: string;
}>`
  width: 200px;
  transform: rotate(-90deg);
  -webkit-appearance: none;
  background: ${(props) => props.$trackColor};
  height: 4px;
  border-radius: 2px;
  cursor: pointer;
  appearance: none;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: ${(props) => props.$color};
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: ${(props) => props.$color};
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
  &:focus {
    outline: none;
  }
`;
