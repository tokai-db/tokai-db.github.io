import React, { useState } from "react";
import supabase from "../services/supabase";
import { uploadImage } from "../services/imagebb";
import { generateUsername } from "../utils/usernameGenerator";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];

function AddInstituteModal({ showModal, setShowModal, updateInstitutes }) {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("Upload Logo");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    if (allowedFileTypes.includes(file.type)) {
      setImageFile(file);
      setImageName(file.name);
    } else {
      toast.error("Unsupported file type. Please upload a JPEG, PNG, or GIF.");
      setImageFile(null);
      setImageName("Upload Logo");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select an image file.");
      return;
    }

    try {
      const imageUrl = await uploadImage(imageFile);
      const username = generateUsername(name);
      const { data, error } = await supabase
        .from("institutes")
        .insert([{ name, profile_image: imageUrl, username }]);

      if (error) {
        console.error(error);
        toast.error("Failed to add institute. Please try again.");
      } else {
        console.log("Institute added:", data);
        toast.success("Institute added successfully!");
        updateInstitutes(data);
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add institute. Please try again.");
    }
  };

  if (!showModal) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-[#111111] bg-opacity-80'>
      <div className='bg-[#1f2224] rounded-3xl px-6 py-12 max-w-md mx-auto w-full relative mx-4'>
        <button
          onClick={() => setShowModal(false)}
          className='bg-red-500 rounded-full w-10 h-10 absolute top-4 right-4 flex items-center justify-center'
        >
          <Icon icon='charm:cross' className='text-white text-2xl' />
        </button>
        <h2 className='text-3xl font-semibold mb-5 text-center'>
          Add Institute
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder="Institute's Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='block w-full p-4 mb-4 bg-[#32373b] rounded-2xl text-center'
          />
          <div className='mb-4'>
            <div className='flex items-center'>
              <label className='border-2 border-[#32373b] border-dashed rounded-2xl cursor-pointer flex items-center justify-center w-full h-full p-4'>
                <input
                  type='file'
                  accept={allowedFileTypes.join(",")}
                  onChange={handleImageChange}
                  className='hidden'
                />
                <span className='text-gray-400'>
                  {imageName.length < 20
                    ? imageName
                    : imageName.substring(0, 4) +
                      "..." +
                      imageName.substring(imageName.length - 8)}
                </span>
                <Icon
                  icon='tabler:upload'
                  className='text-gray-500 ml-3 text-2xl'
                />
              </label>
            </div>
          </div>
          <div className='flex justify-center'>
            <button
              type='submit'
              className='bg-blue-500 rounded-2xl px-8 py-3 mt-4'
            >
              Add Institute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddInstituteModal;
