import { List, ListItem, Text } from "@chakra-ui/react";

const InstructionList = () => {
  return (
    <List w="100%">
      {[
        "點擊文字可以編輯樣式及顏色",
        "可以放大縮小圖片",
        "最多可添加10個文字",
        "聯絡岳越科技 service@advancross.com",
      ].map((item, index) => (
        <ListItem key={index}>
          <Text fontSize="sm" color="gray.500">
            ▸ {item}
          </Text>
        </ListItem>
      ))}
    </List>
  );
};

export default InstructionList;
