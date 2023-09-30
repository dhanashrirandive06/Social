import React, { useEffect, useState } from "react";
import Avatar from "../../assets/avatar.png";
import postImg from "../../assets/postImg.jpg";
import Button from "../../components/Button/Button.Component";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      const res = await fetch(`http://localhost:8000/api/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
      });
      const data = await res.json();
      setPosts(data.posts);
      setUser(data.user);
    };

    getPosts();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        style={{
          backgroundImage:
            " linear-gradient(to right top, #f6e4ee, #f4e5f2, #f1e7f6, #eee8f9, #eaeafc, #e7edfe, #e5efff, #e3f2ff, #e4f6ff, #e6f9ff, #e9fcfe, #eefffe)",
        }}
        className="flex w-[60%] flex-col items-center py-8 px-8 "
      >
        <h1 className="text-4xl font-medium  text-gray-700">Profile</h1>

        <Button
          onClick={() => navigate("/")}
          label="Back"
          className="bg-[#f00f51] hover:bg-[#d1293d] my-5 w-[10%] relative right-[40%] "
        />

        <div className=" flex flex-col items-center mb-1">
          <img className="w-[40%] h-[60%]" src={Avatar} alt="Profile Image" />
          <p className="mb-1">@{user.username}</p>
          <div className="w-[29rem] flex justify-around text-center border p-2 bg-white rounded-lg shadow-md">
            <div className="flex flex-col justify-around items-center">
              <h4 className="text-2xl font-semibold">0</h4>
              <p className="text-lg font-light">posts</p>
            </div>
            <div className="flex flex-col justify-around items-center">
              <h4 className="text-2xl font-semibold">0</h4>
              <p className="text-lg font-light">following</p>
            </div>
            <div className="flex flex-col justify-around items-center">
              <h4 className="text-2xl font-semibold">0</h4>
              <p className="text-lg font-light">followers</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center my-4 flex-wrap ">
          {posts?.length > 0 &&
            posts?.map(
              ({ _id, caption = "", description = "", image = "" }, index) => {
                return (
                  <div
                    className=" shadow-md border m-2 p-2 rounded-lg text-center bg-white"
                    key={index}
                  >
                    <div>
                      {/* Post Img */}
                      <div className="h-[60%] w-full  mb-4 pb-3">
                        <img
                          className="h-[12rem] w-[15rem] rounded-lg mx-auto"
                          src={image}
                          alt="Post Image"
                        />

                        <div className=" mb-4 p-1">
                          <p>{caption}</p>
                        </div>

                        <p className=" text-gray-700 text-[13px] px-1">
                          {description}
                        </p>
                      </div>

                      <div className="flex justify-evenly text-center font-medium my-2">
                        <div className="text-[12px]">
                          0 <i className="fa-regular fa-heart"></i>
                        </div>

                        <div className="text-[12px]">
                          0 <i className="fa-regular fa-bookmark"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
