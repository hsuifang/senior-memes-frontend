import { Box, Flex, Heading, useMediaQuery } from "@chakra-ui/react";

const Header = () => {
  // isMobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Box as="header" borderBottom="1px" borderColor="gray.200">
      <Flex
        h={isMobile ? "10" : "16"}
        align="center"
        justify="center"
        bg="brand.second"
      >
        <Heading as="h1" fontSize="xl" fontWeight="bold" fontFamily="girl">
          為你的圖片添加文字
        </Heading>
      </Flex>
    </Box>
  );
};

export default Header;
