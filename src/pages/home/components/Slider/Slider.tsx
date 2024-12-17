import { memo } from "react";
import { SliderContainer, ValueLabel, RangeInput } from "./SliderStyled";

// types
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  color?: string;
  trackColor?: string;
  width?: string;
  height?: string;
}

const Slider = memo(
  ({
    value,
    onChange,
    min,
    max,
    color = "#ff334c",
    trackColor = "rgba(255, 255, 255, 0.3)",
    width = "40px",
    height = "130px",
  }: SliderProps) => {
    const position = ((value - min) / (max - min)) * 100; // converts value to percentage
    return (
      <SliderContainer width={width} height={height}>
        <ValueLabel $top={`${100 - position}%`}>{value}</ValueLabel>
        <RangeInput
          type="range"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          $color={color}
          $trackColor={trackColor}
          aria-label="Slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </SliderContainer>
    );
  }
);

export default Slider;
