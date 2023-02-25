import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/database";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
function Feed() {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams(null);
  useEffect(() => {
    // console.log("hiii");
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((res) => {
        setPins(res);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((res) => {
        setPins(res);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading)
    return <Spinner message={"We are adding new ideas to your feed!"} />;
  if (!pins?.length)
    return (
      <h2 className="flex items-center justify-center font-bold">
        No Pins Available for the selected category!
      </h2>
    );
  console.log("pins", pins);
  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
}

export default Feed;
