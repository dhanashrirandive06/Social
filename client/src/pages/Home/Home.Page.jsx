import React, { useEffect, useState } from "react";
import Avatar from "../../assets/avatar.png";
import BgImg from "../../assets/bgImg.jpg";
import Input from "../../components/Input/Input.Component";
import Button from "../../components/Button/Button.Component";
import PuffLoader from "react-spinners/PuffLoader";

import { NavLink, Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [save, setSave] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
      });
      const data = await res.json();
      // console.log(" :", data);
      setData(data.posts);
      setUser(data.user);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:8000/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
      });
      const data = await res.json();
      setUsers(data?.users);
    };

    fetchUsers();
  });

  const handleReaction = async (_id, index, reaction = "like") => {
    try {
      const res = await fetch(`http://localhost:8000/api/${reaction}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({ id: _id }),
      });

      const { updatedPost } = await res.json();
      // data[index] = updatedPost;
      const updatePost = data?.map((post, i) => {
        if (i == index) {
          return updatedPost;
        } else {
          return post;
        }
      });
      setData(updatePost);
    } catch (error) {
      console.log(error);
    }
  };

  const searchFunction = (e) => {};

  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundImage:
          " linear-gradient(to right top, #f6e4ee, #f4e5f2, #f1e7f6, #eee8f9, #eaeafc, #e7edfe, #e5efff, #e3f2ff, #e4f6ff, #e6f9ff, #e9fcfe, #eefffe)",
      }}
      className="h-screen w-full flex "
    >
      <div className="w-[25%]  flex flex-col justify-center items-center">
        {loading ? (
          <div className="flex justify-center items-center h-[30%]">
            <PuffLoader />
          </div>
        ) : (
          <div className="h-[50%] m-2 rounded-lg shadow-md w-[90%] border bg-white flex justify-center items-center">
            <div className=" flex flex-col items-center">
              <img
                src={BgImg}
                alt="profile bg Image"
                className="w-full h-[12rem] rounded-lg"
                style={{ marginBottom: "-2rem" }}
              />
              <div className="flex flex-col items-center">
                <div className="w-[5rem] flex justify-center items-center h-[5rem] border rounded-full bg-white">
                  <img
                    loading="lazy"
                    className="max-w-[120%] w-[full] h-[full] "
                    src={Avatar}
                    alt="Profile Image"
                  />
                </div>
                <p className="text-lg text-gray-800 font-medium">
                  {user.username}
                </p>
                <p className="text-sm">I am Dhanashri</p>
                <div className="w-[15rem] mt-3  flex justify-around text-center">
                  <div className="text-md flex flex-col justify-around items-center">
                    <h4 className="text-sm text-gray-500">Posts</h4>
                    <p className="text-gray-800 font-medium">0</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Following</h4>
                    <p className="text-gray-800 font-medium">0</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Followers</h4>
                    <p className="text-gray-800 font-medium">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menus */}
        <div className=" h-[40%] w-[90%] rounded-lg m-2 shadow-md bg-white flex flex-col pl-12">
          <NavLink
            exact
            activeClassName="active"
            className="active:bg-purple-600 active:text-white text-gray-500 mt-8 hover:bg-purple-600 hover:text-white w-[60%] p-2 rounded-lg"
            to={"/"}
          >
            <span className="mx-4 ">
              <i className="fa-solid fa-table-columns"></i>
            </span>
            Dashboard
          </NavLink>
          <NavLink
            exact
            activeClassName="active"
            className="active:bg-purple-600 active:text-white text-gray-500 mt-4 hover:bg-purple-600 hover:text-white w-[60%] p-2 rounded-lg"
            to="/profile"
          >
            <span className="mx-4 ">
              <i className="fa-solid fa-user"></i>
            </span>
            Profile
          </NavLink>
          {/* <Link
            className="text-gray-500 hover:bg-purple-600 hover:text-white w-[60%] p-2 rounded-lg"
            to={"/saved"}
          >
            <span className="mx-4 ">
              <i className="fa-solid fa-bookmark"></i>
            </span>
            Saved
          </Link> */}
          {/* <Link
            className="text-gray-500 hover:bg-purple-600 hover:text-white w-[60%] p-2 rounded-lg"
            to={"/"}
          >
            <span className="mx-4 ">
              <i className="fa-solid fa-users"></i>
            </span>
            Users
          </Link> */}
        </div>
        {/* Logout Div */}
        <div className="flex justify-center items-center h-[10%] w-[90%] m-2 bg-white rounded-lg shadow-md">
          <div
            className="bg-red-500 rounded-lg px-6 text-white p-2 text-xl cursor-pointer"
            onClick={() => {
              localStorage.clear();
              navigate("/account/login");
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </div>
        </div>
      </div>
      <div className="w-[50%]  relative overflow-hidden h-full  ">
        {/* Search and Create Post */}
        <div className="bg-white w-[49%] h-[5rem] mt-2 rounded-lg flex justify-evenly items-center fixed shadow-lg">
          <div className="flex justify-center items-center w-[70%] ">
            <input
              type="text"
              className="border p-3 shadow-sm w-full text-gray-900 bg-[#e7eef988] border-gray-200 rounded-full focus:outline-none"
              placeholder="Enter your Search"
              value={search}
              // onChange={(e) => searchFunction(e)}
            />

            {/* <Button label="Search" className="mb-4 ml-2 px-3" /> */}
          </div>
          <Button
            onClick={() => navigate("/new-post")}
            label="Create Post"
            className="rounded-lg bg-red-500 hover:bg-red-600 mb-4 mt-4 px-4"
          />
        </div>
        {/* Feed */}
        <div className="mb-64 flex flex-col items-center w-[100%] overflow-y-scroll h-full overflow-hidden scrollbar px-8 mt-14 ">
          {loading ? (
            <div className=" flex justify-center items-center h-[90%]">
              <PuffLoader />
            </div>
          ) : data.length > 0 ? (
            data?.map((post, index) => {
              const isAlreadyLiked =
                post?.likes?.length > 0 && post?.likes?.includes(user._id);

              return (
                <div
                  className="h-[60%] bg-white w-[100%] mt-12 px-5 py-2 border my-5 rounded-lg shadow-xl"
                  key={index}
                >
                  {/* Post Details */}
                  <div
                    className="border-b flex items-center mb-4 cursor-pointer"
                    onClick={() =>
                      user.username == post.user.username
                        ? navigate(`/profile`)
                        : navigate(`/user/${post?.user?.username}`)
                    }
                  >
                    <img
                      loading="lazy"
                      src={Avatar}
                      className="w-[4rem] h-[4rem]"
                    />
                    <div className="ml-2">
                      <h3 className="text-xl font-medium">
                        {post.user.username}
                      </h3>
                      <p className="text-sm">{post.user.email}</p>
                    </div>
                  </div>

                  {/* Post Img */}
                  <div className="h-[70%] w-full  ">
                    <img
                      loading="lazy"
                      className="h-[20rem] w-full"
                      src={post.image}
                      alt="Post Image"
                    />
                    <div className=" flex mt-3 py-2">
                      <h3 className="font-medium">{post.user.email} : </h3>
                      <h3 className="ml-2"> {post.caption}</h3>
                    </div>
                    <p className="mt-1 text-gray-700 text-sm">
                      {post.description}
                    </p>
                  </div>

                  <div className="mt-22 pt-10">
                    <div className="flex justify-between">
                      <div
                        className="cursor-pointer bg-blue-100 py-2 px-3 rounded-lg"
                        onClick={() =>
                          isAlreadyLiked
                            ? handleReaction(post._id, index, "unlike")
                            : handleReaction(post._id, index, "like")
                        }
                      >
                        {isAlreadyLiked ? (
                          <i
                            className="fa-solid fa-heart fa-lg mx-1"
                            style={{ color: "#e21818" }}
                          ></i>
                        ) : (
                          <i className="fa-regular fa-lg fa-heart mx-1"></i>
                        )}

                        <span className="text-sm">
                          {post.likes?.length} Likes
                        </span>
                      </div>
                      {/* <div className="font-medium text-gray-700 cursor-pointer bg-blue-100 py-2 px-3 rounded-lg">
                          <i className="fa-regular fa-lg mx-2 fa-comment"></i>
                          <span className="text-sm">Comments</span>
                        </div> */}

                      <div
                        onClick={() => setSave(!save)}
                        className="font-medium text-gray-700 cursor-pointer bg-blue-100 py-2 rounded-lg px-3"
                      >
                        {save ? (
                          <>
                            <i class="fa-solid fa-lg  mx-2 fa-bookmark"></i>
                            <span className="text-sm">Unsave</span>
                          </>
                        ) : (
                          <>
                            <i className="fa-regular fa-lg fa-bookmark mx-2"></i>
                            <span className="text-sm">Save</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-4xl text-gray-600 h-full flex justify-center items-center font-medium">
              No Post to Show!
            </div>
          )}
        </div>
      </div>
      <div className="w-[25%] bg-white border-l flex flex-col items-center overflow-y-scroll scrollbar">
        {/* Trending Feeds */}
        <h2 className="my-2 font-semibold text-gray-800 ">Active Users</h2>
        <div className="w-[80%] bg-[#f0f2f4] rounded-xl shadow-md my-2 p-3 flex flex-col justify-center items-center">
          {users?.map(({ username }, index) => {
            if (username !== user.username)
              return (
                <div
                  className="cursor-pointer w-[95%] bg-white p-2 rounded-lg my-3 flex justify-start items-center"
                  key={index}
                  onClick={() => {
                    navigate(`/user/${username}`);
                  }}
                >
                  <img src={Avatar} className="w-[3rem] h-[3rem]" />
                  <h2 className="text-gray-700">@{username}</h2>
                </div>
              );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
