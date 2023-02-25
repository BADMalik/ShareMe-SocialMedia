import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/database";
const CreatePin = ({ user }) => {
  console.log("asdaw", user);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState("");
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  console.log(categories);
  const navigate = useNavigate();
  const uploadImage = async (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/jpg" ||
      selectedFile.type === "image/gif"
    ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((asset) => {
          setImageAsset(asset);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selectedFile);
      fileReader.onload = () => {
        setImageAsset(fileReader.result);
      };
    } else {
      setWrongImageType(true);
    }
  };
  const savePin = (e) => {
    if (title && about && destination && category && imageAsset?._id) {
      const docs = {
        _type: "pin",
        title,
        about,
        destination,
        category,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        postedBy: {
          _type: "postedBy",
          _ref: user?._id,
        },
        userId: user._id,
      };
      client.create(docs).then((res) => {
        console.log(res);
        navigate("/home");
      });
    } else {
      setFields(true);
      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center mt-5 lg:h-4/5">
      {fields && (
        <p className="mb-5 text-xl text-red-500 duration-150 ease-in translation-all">
          Please fill all the fields
        </p>
      )}
      <div className="flex flex-col items-center justify-center w-full p-3 m-2 bg-white lg:flex-row lg:p-5 lg:w-4/5">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex flex-col items-center justify-center w-full p-3 border-2 border-gray-300 border-dotted h-420">
            {loading && <Spinner />}
            {wrongImageType ?? (
              <p className="mb-5 text-xl text-red-500 duration-150 ease-in translation-all">
                Wrong Image type
              </p>
            )}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col items-center justify-center cursor-pointer">
                    <p className="text-2xl font-bold ">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg"> Click to Upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Use high-quality JPG, JPEG, PNG GIF less than 20 MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-9"
                ></input>
              </label>
            ) : loading ? (
              <div className="relative h-full">
                <p className="items-center justify-center duration-150 ease-in translation-all">
                  Your picture is being uploaded, please wait!
                </p>
              </div>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="upload"
                  className="w-full h-full"
                />
                <button
                  type="button"
                  className="absolute p-3 text-xl transition-all duration-75 ease-in-out bg-white rounded-full outline-none cursor-pointer bottom-3 right-3 hover:shadow-md"
                  onClick={() => {
                    setImageAsset(null);
                  }}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 w-full gap-6 mt-5 lg-pl-5">
          <input
            type="text"
            placeholder="Title"
            className="p-2 text-2xl font-bold border-b-2 outline-none sm:3xl border-grey-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {user.email ? (
            <div className="flex items-center gap-2 my-2 bg-white rounded-lg ">
              <img
                alt="user-profile"
                src={user.image}
                className="w-10 h-10 rounded-full"
              />
              <p className="font-bold ">{user.userName}</p>
            </div>
          ) : (
            ""
          )}
          <input
            type="text"
            placeholder="About"
            className="p-2 text-2xl border-b-2 outline-none sm:lg border-grey-200"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <input
            type="text"
            placeholder="Destination"
            className="p-2 text-2xl border-b-2 outline-none sm:lg border-grey-200"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <div className="flex flex-col">
            <div>
              <p className="pb-2 text-lg font-semibold sm:text-xl ">
                Choose Pin Category
              </p>
              <select
                className="w-4/5 p-2 text-base border-b-2 rounded-md outline-none cursor-pointer border-gray-2 "
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option
                  value="Select Category"
                  className="bg-white"
                  selected
                  disabled
                  hidden
                ></option>
                {categories.map((category) => (
                  <option
                    className="text-base text-black capitalize bg-white border-0 outline-none "
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end mt-5 item-end">
              <button
                type="button"
                onClick={savePin}
                className="p-2 font-bold text-white bg-red-500 rounded-full outline-none w-28"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
