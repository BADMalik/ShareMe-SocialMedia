import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/database";
import Spinner from "./Spinner";
function PinDetail({ user }) {
  const [pin, setPin] = useState(null);
  const [pinDetails, setPinDetails] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();
  const addComment = async () => {
    if (comment) {
      setAddingComment(true);
      client
        .patch(pinId)
        .setIfMissing({ comment: [] })
        .insert("after", "comment[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(async (res) => {
          await fetchPinDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };
  const fetchPinDetails = async () => {
    const query = await pinDetailQuery(pinId);
    if (query) {
      client.fetch(query).then(async (pinDetails) => {
        console.log(
          "11111111111111111111111111111111111111111111111",
          pinDetails
        );
        setPinDetails(pinDetails[0]);
        if (pinDetails[0]) {
          let query = await pinDetailMorePinQuery(pinDetails[0]);
          client.fetch(query).then((pins) => {
            setPin(pins);
          });
        }
      });
    }
  };
  console.log("pinDetails", pinDetails, pin);
  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetails) return <Spinner message={"Loading Pin Details"} />;
  return (
    <>
      <div
        className="flex flex-col m-auto bg-white xl-flex-row"
        style={{ maxWidth: "1200px", borderRadius: "32px" }}
      >
        <div className="flex items-center justify-center flex-initial md:items-start ">
          <img
            className="rounded-b-lg rounded-t-3xl"
            alt="detail"
            src={pinDetails?.image && urlFor(pinDetails.image).url()}
          />
        </div>
        <div className="flex-1 w-full p-5 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                className="flex items-center justify-center text-xl bg-white rounded-full outline-none opacity-75 hover:shadow-md hover:opacity-100 w-9 h-9 text-dark"
                href={`${pinDetails.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a href={pinDetails.destination} target="_blank" rel="noreferrer">
              {pinDetails.destination}
            </a>
          </div>
          <div>
            <h1 className="mt-3 text-4xl font-bold break-words">
              {pinDetails.title}
            </h1>
            <p className="mt-3">{pinDetails.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetails.postedBy?._id}`}
            className="flex items-center gap-2 mt-5 bg-white rounded-lg"
          >
            <img
              src={pinDetails.postedBy.image}
              alt="user"
              className="h-12 rounded-lg w-14"
            />
            <p className="font-semibold capitalize">
              {pinDetails.postedBy.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="overflow-y-auto max-h-370">
            {pinDetails?.comment?.map((data, i) => (
              <div
                className="flex items-center gap-2 mt-5 bg-white rounded-lg"
                key={i}
              >
                <img
                  src={data.postedBy.image}
                  alt={`user-${i}`}
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold ">{data.postedBy.userName}</p>
                  <p>{data.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to={`/user-profile/${pinDetails.postedBy?._id}`}>
              <img
                src={pinDetails.postedBy.image}
                alt="user"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </Link>
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 p-2 border-2 border-gray-100 outline-none rounded-2xl focus:border-gray-300 "
            />
            <button
              type="button"
              onClick={addComment}
              className="px-6 py-2 text-base font-semibold text-white bg-red-500 rounded-full outline-none"
            >
              {addingComment ? "Adding comment" : "Post"}
            </button>
          </div>
        </div>
      </div>
      {pin?.length > 0 ? (
        <>
          <h2 className="mt-8 mb-4 text-2xl font-bold text-center">
            More Link This
          </h2>
          <MasonryLayout pins={pin} />
        </>
      ) : (
        <Spinner message={"Loading More Pins"} />
      )}
    </>
  );
}

export default PinDetail;
