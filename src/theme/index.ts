// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";

const fonts = {
  girl: `
    @font-face {
      font-family: 'PopGothicCjkTc';
      src: url('/CJKTC/PopGothicCjkTc-Light.woff2') format('woff2');
      font-weight: 300;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'PopGothicCjkTc';
      src: url('/CJKTC/PopGothicCjkTc-Regular.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'PopGothicCjkTc';
      src: url('/CJKTC/PopGothicCjkTc-SemiBold.woff2') format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
  `,
};

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
      ...fonts,
    },
  },
  colors,
  fonts: {
    body: `'Noto Sans', 'Raleway', sans-serif`,
    girl: `'PopGothicCjkTc', 'Noto Sans', 'Raleway', sans-serif`,
    monospace: `'Noto Sans', 'Raleway', sans-serif`,
  },
});

export default theme;
