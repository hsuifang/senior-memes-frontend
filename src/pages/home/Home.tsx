import { Box, Card, CardBody, Container } from "@chakra-ui/react";
import DesignCanvas from "./components/DesignCanvas/DesignCanvas";
import TextEditor from "./components/TextEditor";
import LoadingOverlay from "@/components/LoadingOverlay";
import ControlPanel from "./components/ControlPanel";
import InstructionList from "./components/InstructionList";
import useHomeLogic from "./hooks/useHomeLogic";

const Home = () => {
  const {
    isLoading,
    imageUrl,
    userTextInfo,
    editTextInfo,
    scale,
    designCanvasRef,
    handleUploadImage,
    handleScaleChange,
    handleAddText,
    handleTextInfoChange,
    handleDeleteText,
    setEditTextInfo,
    canAddMoreText,
    canGenerateImage,
    defaultImageUrl,
  } = useHomeLogic();

  return (
    <Container maxW="container.md">
      <Box
        as="main"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {isLoading && <LoadingOverlay />}

        <Card variant="unstyled" py={2}>
          <CardBody>
            <Box
              as="section"
              data-testid="canvas-section"
              border="1px solid #ccc"
            >
              {/* 1. Canva Image */}
              <DesignCanvas
                ref={designCanvasRef}
                scale={scale}
                imageUrl={imageUrl || defaultImageUrl}
                textInfo={userTextInfo}
                onEditTextInfo={handleTextInfoChange}
                onDeleteText={handleDeleteText}
                onScaleChange={handleScaleChange}
              />
            </Box>
            {/* 2. 增加文字 */}
            <ControlPanel
              handleAddText={handleAddText}
              handleUploadImage={handleUploadImage}
              canAddMoreText={canAddMoreText}
              canGenerateImage={canGenerateImage}
            />
            {/* 3. 指令列表 */}
            <InstructionList />

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
            {/* <PhotoUploader setImageUrl={setImageUrl} /> */}
          </CardBody>
        </Card>
      </Box>
    </Container>
  );
};

export default Home;
