import { Input, Button } from "@chakra-ui/react";

const PhotoUploader = ({
  setImageUrl,
}: {
  setImageUrl: (val: string) => void;
}) => {
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
  return (
    <>
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
    </>
  );
};

export default PhotoUploader;
