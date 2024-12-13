import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Card, CardBody, Button, Text, Input } from "@chakra-ui/react";
import DesignCanvas, { DesignCanvasRef } from "./components/DesignCanvas";
// import PhotoUploader from "./components/PhotoUploader";
import TextEditor from "./components/TextEditor";
import { ITextInfo } from "./types/textEditor";
import { AddIcon } from "@chakra-ui/icons";
import IMAGEPLACE from "@/assets/react.svg";

const Home = () => {
  // if queryString has id then call api to get memeImage and hidden upload image button
  // if queryString has no id then show upload image button
  const [editTextInfo, setEditTextInfo] = useState<ITextInfo | null>(null);
  const [userTextInfo, setUserTextInfo] = useState<ITextInfo[]>([]);
  // const [imageUrl, setImageUrl] = useState(null);
  const designCanvasRef = useRef<DesignCanvasRef>(null);
  // 1. scale
  const [scale, setScale] = useState(1);

  // Image
  // const [fontFamily, setFontFamily] = useState("monospace");

  const handleAddText = () => {
    const newText: ITextInfo = {
      id: Date.now().toString(), // Simple way to generate unique id
      text: `新文字${Date.now().toString().slice(5, 8)}`,
      x: 0, // Starting position
      y: 0,
      fontSize: 40,
      color: "black",
      direction: "horizontal",
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

  // TODO: upload image
  const handleUploadImage = async () => {
    try {
      await designCanvasRef.current?.downloadCanvas();
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const onTextInfoChange = (info: ITextInfo | null) => {
    if (info) {
      // console.log(e)
      const newInfoSet = userTextInfo.map((txt) =>
        txt.id === info.id ? info : txt
      );
      setUserTextInfo(newInfoSet);
    }
    setEditTextInfo(info);
  };

  const handleDeleteText = (id: string) => {
    const newTextInfo = userTextInfo.filter((txt) => txt.id !== id);
    setUserTextInfo(newTextInfo);
    setEditTextInfo(null);
  };

  // const handleFontFamilyChange = (family: string) => {
  //   //
  //   console.log(family);
  // };

  // Add handler for scale changes
  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
  };

  // if quuery string has imageId then call api to get image
  const [searchParams] = useSearchParams();
  const imageId = searchParams.get("imageId");

  useEffect(() => {
    if (imageId) {
      // call api to get image
      console.log(imageId);
    }
  }, [imageId]);

  return (
    <Box as="main" display="flex" flexDirection="column" alignItems="center">
      {/* TODO: 4. Upload Modify Image Button*/}
      <Button onClick={handleUploadImage}>匯出圖片</Button>
      <Card>
        <CardBody>
          {/* 1. Canva Image */}
          <Box
            as="section"
            data-testid="canvas-section"
            border="3px dashed #ccc"
            padding={2}
          >
            <DesignCanvas
              ref={designCanvasRef}
              scale={scale}
              imageUrl={IMAGEPLACE}
              textInfo={userTextInfo}
              onEditTextInfo={onTextInfoChange}
              onDeleteText={handleDeleteText}
              onScaleChange={handleScaleChange}
            />
          </Box>
          <Card>
            <CardBody fontFamily="sans-serif">
              <Box>
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

          {/* 2. TextEditor */}
          {editTextInfo && (
            <TextEditor
              textInfo={editTextInfo}
              onFinish={(textInfo) => {
                handleTextInfoChange(textInfo);
                setEditTextInfo(null);
              }}
              onCancel={() => handleTextInfoChange(null)}
            />
          )}
        </CardBody>
      </Card>
      {/* <PhotoUploader setImageUrl={setImageUrl} /> */}
    </Box>
  );
};

export default Home;
