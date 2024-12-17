import req from "@/lib/api";

export const getImage = async (imageId: string, idToken: string) => {
  const response = await req.get(`/images/${imageId}?id_token=${idToken}`, {
    responseType: "blob",
  });
  return response.data;
};

export const saveImage = async (
  image: Blob,
  id_token: string,
  image_id: string
) => {
  const response = await req.post(
    "/images/upload",
    { image, image_id, id_token },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
