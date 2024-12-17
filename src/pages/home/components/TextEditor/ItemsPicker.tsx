import { Box, Flex, Text } from "@chakra-ui/react";

interface IItem {
  val: string;
  label: string;
}

interface ItemsPickerProps {
  itemWidth?: string;
  type: "text" | "color" | "font";
  items: IItem[];
  selectedItem: string | undefined;
  onChange: (item: string) => void;
}

const ItemsPicker = ({
  itemWidth = "15%",
  type,
  items,
  selectedItem,
  onChange,
}: ItemsPickerProps) => {
  const isColorType = type === "color";
  const isFontType = type === "font";

  const renderItem = (item: IItem) => {
    const isSelected = selectedItem === item.val;

    return (
      <Box
        key={item.val}
        flexShrink={0}
        w={itemWidth}
        position="relative"
        paddingBottom={itemWidth}
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg={isColorType ? item.val : "white"}
          cursor="pointer"
          border="3px solid"
          backgroundClip="padding-box"
          borderColor={isSelected ? "blue.200" : "transparent"}
          fontFamily={isFontType ? item.val : "monospace"}
          borderRadius={isColorType ? "50%" : "5px"}
          transition="all 0.2s"
          onClick={() => onChange(item.val)}
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{
            borderColor: "blue.100",
          }}
        >
          {!isColorType && (
            <Text as="p" fontWeight="bold">
              {item.label}
            </Text>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      w="100%"
      maxW="500px"
      overflowY="hidden"
      overflowX="auto"
      scrollbar-width="thin"
    >
      <Flex gap="2%" py={1}>
        {items.map(renderItem)}
      </Flex>
    </Box>
  );
};

export default ItemsPicker;
