import { useEffect } from "react";
import Router from "./routes";
import { useLiffStore } from "./store/useLiffStore";
import { Box, Flex, Spinner } from "@chakra-ui/react";

// Temp
function App() {
  const { initLiff, isLiffReady, errorMsg } = useLiffStore();
  useEffect(() => {
    initLiff();
  }, []);

  if (errorMsg) {
    return <div>{errorMsg}</div>;
  }

  if (!isLiffReady) {
    return (
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Box>圖片產生中請等待 ...</Box>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="gray.500"
          size="xl"
        />
      </Flex>
    );
  }

  return (
    <Box height="100dvh" overflow="hidden">
      <Router />
    </Box>
  );
}

export default App;
