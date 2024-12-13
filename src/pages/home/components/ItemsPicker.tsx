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
  console.log(selectedItem);
  return (
    <Box w="100%" maxW="500px" overflowY="hidden" scrollbar-width="thin">
      <Flex gap="2%">
        {items.map((item) => (
          <Box
            key={item.val}
            flexShrink={0}
            w={itemWidth}
            position="relative"
            paddingBottom={itemWidth}
          >
            {/* TODO: 文字選擇器 */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg={type !== "color" ? "white" : item.val}
              cursor="pointer"
              border="3px solid"
              backgroundClip="padding-box"
              borderColor={
                selectedItem === item.val ? "blue.200" : "transparent"
              }
              fontFamily={type === "font" ? item.val : "monospace"}
              borderRadius={type !== "color" ? "5px" : "50%"}
              transition="all 0.2s"
              onClick={() => onChange(item.val)}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text as="p" fontWeight="bold">
                {type !== "color" && item.label}
              </Text>
            </Box>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default ItemsPicker;
