import React, { useEffect, useRef, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Route, Routes, Link } from "react-router-dom";
import { Sidebar, UserProfile, Login } from "../components";
import { client } from "../client";
import logo from "../assets/logo.png";
import Pin from "../containers/Pin";
import { getUserQuery } from "../utils/database";
const Home = () => {
  const scrollRef = useRef(null);
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [user, setUser] = useState(null);
  const userInfo = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : localStorage.clear();
  useEffect(() => {
    const query = getUserQuery(userInfo.id);
    client.fetch(query).then((res) => {
      console.log(res, "res");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user")),
          ...res[0],
        })
      );
      setUser(res[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });
  // const setSidePar
  console.log(user, " user");
  return (
    <div className="flex flex-col duration-75 ease-out bg-gray-50 md:flex-row transition-height">
      <div className="flex-initial hidden h-screen md:flex">
        <Sidebar user={user && user} />
      </div>
      {/**
       * Mobile View
       */}
      <div className="flex flex-row md:hidden">
        <div className="flex flex-row items-center justify-between w-full p-2 shadow-md">
          <HiMenu
            className="cursor-pointer"
            fontSize={40}
            onClick={() => {
              setToggleSideBar(true);
              // console.log('asdw')
            }}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img
              src={user?.image}
              alt="logo"
              className="rounded w-28 sm:w-14"
            />
          </Link>
        </div>
        {/**
         * Side Bar for mobile view
         */}
        {toggleSideBar && (
          <div className="fixed z-10 w-4/5 h-screen overflow-y-auto bg-white shadow-md animate-slide-in">
            <div className="absolute flex items-center justify-end w-full p-2">
              <AiFillCloseCircle
                className="cursor-pointer"
                fontSize={30}
                onClick={() => {
                  setToggleSideBar(false);
                }}
              />
            </div>
            <Sidebar closeToggle={setToggleSideBar} user={user && user} />
          </div>
        )}
      </div>
      <div className="flex-1 h-screen pb-2 overflow-y-scrool " ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pin user={userInfo && userInfo} />} />
        </Routes>
      </div>
    </div>
  );
};
export default Home;
