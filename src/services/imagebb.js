import axios from "axios";

const imagebbAPIKey = process.env.REACT_APP_IMAGEBB_API_KEY;
const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];

const uploadImage = async (imageFile) => {
  if (!allowedFileTypes.includes(imageFile.type)) {
    throw new Error(
      "Unsupported file type. Please upload a JPEG, PNG, or GIF."
    );
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${imagebbAPIKey}`,
      formData
    );
    return response.data.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export { uploadImage };
