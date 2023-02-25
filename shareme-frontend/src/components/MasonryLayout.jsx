import React from "react";
import Masonry from "react-masonry-css";
import SinglePin from "./SinglePin";
import Pin from "./SinglePin";

const breakPointObject = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};
function MasonryLayout({ pins }) {
  console.log("pins", pins);
  return (
    <Masonry
      className="flex animate-slide-fwd"
      breakpointCols={breakPointObject}
    >
      {pins?.map((data) => (
        <SinglePin key={data._id} pin={data} className="w-max" />
      ))}
    </Masonry>
  );
}

export default MasonryLayout;
