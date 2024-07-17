import React, { useState } from "react";
import supabase from "../services/supabase";
import { uploadImage } from "../services/imagebb";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];

function AddTokaiModal({ showModal, setShowModal, instituteId, updateTokais }) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("Upload a photo of the tokai *");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (allowedFileTypes.includes(file.type)) {
      setImageFile(file);
      setImageName(file.name);
    } else {
      toast.error("Unsupported file type. Please upload a JPEG, PNG, or GIF.");
      setImageFile(null);
      setImageName("Upload a photo of the tokai *");
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
      const { data, error } = await supabase
        .from("unapproved_tokais")
        .insert([
          {
            institute_id: instituteId,
            name,
            department,
            batch,
            image: imageUrl,
            additional_info: additionalInfo,
          },
        ])
        .single();

      if (error) {
        console.error(error);
        toast.error("Failed to add Tokai. Please try again.");
      } else {
        toast.success("Tokai submitted for approval!");
        updateTokais(data);
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image. Please try again.");
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
        <h2 className='text-3xl font-semibold mb-5 text-center text-white'>
          Add Tokai
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder="Tokai's Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='block w-full p-4 mb-4 bg-[#32373b] rounded-2xl text-white'
          />
          <input
            type='text'
            placeholder='Department/Hall *'
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            className='block w-full p-4 mb-4 bg-[#32373b] rounded-2xl text-white'
          />
          <input
            type='text'
            placeholder='Batch *'
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            required
            className='block w-full p-4 mb-4 bg-[#32373b] rounded-2xl text-white'
          />
          <div className='mb-4'>
            <div className='flex items-center'>
              <label className='border-2 border-[#32373b] border-dashed rounded-2xl cursor-pointer flex items-center justify-center w-full h-full p-4'>
                <input
                  type='file'
                  accept={allowedFileTypes.join(",")}
                  onChange={handleImageChange}
                  className='hidden'
                  required
                />
                <span className='text-gray-400'>
                  {imageName.length < 20 ||
                  imageName === "Upload a photo of the tokai *"
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
          <textarea
            placeholder='Additional Info (Proof, Drive Link, etc.) *'
            value={additionalInfo}
            required
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className='block w-full p-4 mb-4 bg-[#32373b] rounded-2xl text-white h-30 resize-none'
          />
          <label className='text-gray-400'>
            <b className='mr-1'>N.B:</b> Proof must be uploaded for verification
          </label>
          <div className='flex justify-center'>
            <button
              type='submit'
              className='bg-blue-500 rounded-2xl px-8 py-3 mt-4'
            >
              Add Tokai
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTokaiModal;
