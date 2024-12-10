import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Card, CardBody, Button, Text, Input } from "@chakra-ui/react";
import DesignCanvas, { DesignCanvasRef } from "./components/DesignCanvas";
import TextEditor from "./components/TextEditor";
import { ITextInfo } from "./types/textEditor";
import { AddIcon } from "@chakra-ui/icons";

const Home = () => {
  // if queryString has id then call api to get memeImage and hidden upload image button
  // if queryString has no id then show upload image button
  const [editTextInfo, setEditTextInfo] = useState<ITextInfo | null>(null);
  const [userTextInfo, setUserTextInfo] = useState<ITextInfo[]>([]);
  const designCanvasRef = useRef<DesignCanvasRef>(null);
  // 1. scale
  const [scale, setScale] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get the file from the e.target
    // reader the file and set file to imageUrl
    //   => new Filereader
    //   => reader.readAsDataURL / reader.onload
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddText = () => {
    const newText: ITextInfo = {
      id: Date.now().toString(), // Simple way to generate unique id
      text: `新文字${Date.now().toString().slice(5, 8)}`,
      x: 200, // Starting position
      y: -200,
      fontSize: 40,
      color: "white",
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

  const handleDeleteText = (id: string) => {
    const newTextInfo = userTextInfo.filter((txt) => txt.id !== id);
    setUserTextInfo(newTextInfo);
    setEditTextInfo(null);
  };

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
      <Button onClick={handleUploadImage}>修改圖片</Button>
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
              imageUrl={imageUrl}
              textInfo={userTextInfo}
              onTextInfoChange={setEditTextInfo}
              onDeleteText={handleDeleteText}
              scale={scale}
              onScaleChange={handleScaleChange}
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

          {/* Add upload button refer to input type=file */}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            display="none"
            id="image-upload"
          />
          <Button as="label" htmlFor="image-upload">
            HA
          </Button>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Home;
