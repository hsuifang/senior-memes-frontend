import {
  Box,
  Flex,
  Heading,
  Icon,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { FaQuestionCircle } from "react-icons/fa";
import CustomModal from "./Modal";

import InstructionList from "@/pages/home/components/InstructionList";

const Header = () => {
  // isMobile
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box as="header" borderBottom="1px" borderColor="gray.200">
        <Flex
          h={isMobile ? "10" : "16"}
          align="center"
          justify="space-between"
          bg="brand.second"
          px={4}
        >
          <Heading
            as="h1"
            fontSize="xl"
            fontWeight="bold"
            fontFamily="girl"
            textAlign="center"
          >
            為你的圖片添加文字
          </Heading>
          <Box
            textAlign="right"
            cursor="pointer"
            onClick={() => onOpen()}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="20px"
            p={2}
          >
            <Icon as={FaQuestionCircle} />
          </Box>
        </Flex>
      </Box>
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <InstructionList />
      </CustomModal>
    </>
  );
};

export default Header;
