import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { categories } from "../utils/database";
import logo from "../assets/logo.png";
const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSideBar = () => {
    if (closeToggle) {
      closeToggle(false);
    }
  };
  // const categories = [
  //     { name: 'Animals' },
  //     { name: 'Wallpapers' },
  //     { name: 'Gaming' },
  //     { name: 'Photography' },
  //     { name: 'Coding' }
  // ]
  const isNotActiveStyle =
    "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duratoon-200 ease-in-out capitalize";
  const isActiveStyle =
    "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duratoon-200 ease-in-out capitalize";
  return (
    <div className="flex flex-col justify-between h-full overflow-y-scroll bg-white min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          onClick={handleCloseSideBar}
          to="/"
          className="flex items-center gap-2 px-5 pt-1 my-6 w-190"
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/home"
            onClick={handleCloseSideBar}
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="px-5 mt-2 text-base 2xl:text-xl">
            Discover Categories
          </h3>
          {categories.slice(0, categories.length - 1).map((data) => (
            <NavLink
              onClick={handleCloseSideBar}
              key={data.name}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              to={`/category/${data.name}`}
            >
              <img
                src={data.image}
                alt={data.name}
                className="w-8 h-8 rounded-full shadow-sm"
              />
              {data.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          onClick={handleCloseSideBar}
          to={`user-profile/${user._id}`}
          className="flex items-center gap-2 mx-3 my-5 mb-3 bg-white rounded-lg shadow-2xl"
        >
          <img
            src={user.image}
            alt="user-profile"
            className="w-10 h-10 rounded-full"
          />
          <p>{user.userName}</p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
