import React, { useState } from "react";
import { urlFor, client } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { returnUserInfo } from "../utils/utiliyFunctions";

const SinglePin = ({
  pin: {
    postedBy,
    image,
    title,
    save,
    destination,
    description,
    category,
    _id,
  },
}) => {
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();
  const [savingPost, setSavingPost] = useState(false);
  const userInfo = returnUserInfo();
  //   console.log(
  //     "singlePin",
  //     destination,
  //     postedBy,
  //     userInfo,
  //     save,
  //     save?.filter((data) => data._postedBy?._id === userInfo?._id)
  //   );
  const alreadySaved = !!save?.filter(
    (data) => data.postedBy?._id === userInfo?.id
  )?.length;
  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);
      client
        .patch(id)
        .set({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: userInfo._id,
            postedBy: {
              _type: "post",
              _ref: userInfo._id,
            },
          },
        ])
        .commit()
        .then((res) => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };
  console.log("saved", save, alreadySaved, userInfo);
  const deletePin = (id) => {
    client.delete(id).then((res) => {
      window.location.reload();
    });
  };
  return (
    <div className="m-2">
      <div
        className="relative w-auto overflow-hidden transition-all duration-500 ease-in-out rounded-lg cursor-zoom-in hover:shadow-lg"
        onMouseEnter={(e) => {
          setPostHovered(true);
        }}
        onMouseLeave={(e) => {
          setPostHovered(false);
        }}
        onClick={(e) => navigate(`/pin-detail/${_id}`)}
      >
        <img
          className="w-full rounded-lg"
          alt="pin"
          src={urlFor(image).width(250).url()}
        />
        {postHovered && (
          <div
            style={{ height: "100%" }}
            className="absolute top-0 z-50 flex flex-col justify-between w-full h-full p-1 pt-2 pb-2 pr-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  className="flex items-center justify-center text-xl bg-white rounded-full outline-none opacity-75 hover:shadow-md hover:opacity-100 w-9 h-9 text-dark"
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="px-5 py-1 text-base font-bold text-white bg-red-500 outline-none opacity-70 hover:opacity-100 rounded-3xl hover:shadow-md"
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  type="button"
                  className="p-2 px-5 py-1 text-base font-bold bg-white outline-none opacity-70 hover:opacity-100 rounded-3xl hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex items-center justify-between w-full gap-2">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 pl-4 pr-4 font-bold text-black bg-white rounded-full opacity-70 hover:shadow-md hover:opacity-100"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20
                    ? destination.slice(12, 20)
                    : destination.slice(8)}
                </a>
              )}
              {postedBy?._id === userInfo?._id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="p-2 font-bold bg-white outline-none text-baseI text-dark opacity-70 hover:opacity-100 rounded-3xl hover:shadow-md"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="flex items-center gap-2 p-1 mt-2 rounded-full shadow-xl "
      >
        <img
          src={postedBy?.image}
          alt="user-profile"
          className="object-cover w-8 h-8 rounded-full"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default SinglePin;
