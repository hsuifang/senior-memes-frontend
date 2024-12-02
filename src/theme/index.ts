// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    main: "#F5A900",
    second: "#EFC534",
    beige: "#f9f5f0",
    selection: "#FFF3D9",
  },
  neutral: {
    black: "#1E1A14",
    brown: "#524C42",
    gray: "#C7C7C7",
    darkGray: "#837F79",
    lightGray: "#BCBAB6",
  },
  yellow: "#E9B400",
  white: "#FFFFFF",
};

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: "#524C42",
        lineHeight: "1.68",
        letterSpacing: "0.5px",
      },
    },
  },
  colors,
  fonts: {
    body: `'Noto Sans', 'Raleway', sans-serif`,
  },
});

export default theme;
