import { useState } from "react";
import { Box, Card, CardBody, Button, Text } from "@chakra-ui/react";
import DesignCanvas from "./components/DesignCanvas";
import TextEditor from "./components/TextEditor";
import { ITextInfo } from "./types/textEditor";
import { AddIcon } from "@chakra-ui/icons";

const Home = () => {
  // if queryString has id then call api to get memeImage and hidden upload image button
  // if queryString has no id then show upload image button
  const [editTextInfo, setEditTextInfo] = useState<ITextInfo | null>(null);
  const [userTextInfo, setUserTextInfo] = useState<ITextInfo[]>([]);

  const handleAddText = () => {
    const newText: ITextInfo = {
      id: Date.now().toString(), // Simple way to generate unique id
      text: `新文字${Date.now().toString().slice(5, 8)}`,
      x: 200, // Starting position
      y: -200,
      fontSize: 20,
      color: "black",
    };
    setUserTextInfo([...userTextInfo, newText]);
  };

  const handleTextInfoChange = (textInfo: ITextInfo | null) => {
    if (textInfo === null) {
      setEditTextInfo(null);
      return;
    }
    // setTextIntoEditBox
    const result = userTextInfo.map((txt) =>
      txt.id === textInfo.id ? textInfo : txt
    );
    setUserTextInfo(result);
    setEditTextInfo(textInfo);
  };

  return (
    <Box
      as="main"
      bgColor="gray.100"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {/* TODO: 4. Upload Modify Image Button*/}
      <Card>
        <CardBody>
          {/* 1. Canva Image */}
          <Box
            as="section"
            data-testid="canvas-section"
            display="flex"
            justifyContent="center"
          >
            <DesignCanvas
              imageUrl="https://picsum.photos/500/500"
              textInfo={userTextInfo}
              onTextInfoChange={setEditTextInfo}
            />
          </Box>
          {/* 2. TextEditor */}
          {!editTextInfo ? (
            <Card>
              <CardBody fontFamily="sans-serif">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text p={2}>點擊文字可以進行編輯</Text>
                  <Button
                    colorScheme="blue"
                    onClick={handleAddText}
                    leftIcon={<AddIcon />}
                    disabled={userTextInfo.length >= 2}
                  >
                    新增文字
                  </Button>
                </Box>
              </CardBody>
            </Card>
          ) : (
            <TextEditor
              textInfo={editTextInfo}
              onChange={handleTextInfoChange}
            />
          )}
          {/* TODO: 3. Upload Image Button*/}
        </CardBody>
      </Card>
    </Box>
  );
};

export default Home;
