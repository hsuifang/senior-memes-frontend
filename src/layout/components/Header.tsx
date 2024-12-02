import { Box, Flex, Heading } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box as="header" borderBottom="1px" borderColor="gray.200">
      <Flex h="16" align="center" justify="center" bg="brand.second">
        <Heading as="h1" fontSize="xl" fontWeight="medium" color="brand.white">
          分享圖片
        </Heading>
      </Flex>
    </Box>
  );
};

export default Header;
