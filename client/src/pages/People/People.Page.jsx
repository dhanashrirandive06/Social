import React, { useEffect, useState } from "react";
import Avatar from "../../assets/avatar.png";
import postImg from "../../assets/postImg.jpg";
import { useParams } from "react-router-dom";
import Button from "../../components/Button/Button.Component";
import PuffLoader from "react-spinners/PuffLoader";
import { useNavigate } from "react-router-dom";
const People = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/people?username=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user:token")}`,
          },
        }
      );
      const data = await res.json();
      setPosts(data?.posts);
      setUser(data?.userDetails);
      setIsFollowed(data?.isFollowed);
      setLoading(false);
    };

    getPosts();
  }, []);
  console.log(username);

  //Follow function
  const handleFollow = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:8000/api/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user:token")}`,
      },
      body: JSON.stringify({ id: user.id }),
    });
    const data = await res.json();
    setIsFollowed(data?.isFollowed);
    setLoading(false);
  };

  //UnFollow function
  const handleUnfollow = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:8000/api/unfollow`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user:token")}`,
      },
      body: JSON.stringify({ id: user.id }),
    });
    const data = await res.json();
    setIsFollowed(data?.isFollowed);
    setLoading(false);
  };

  if (loading && !posts?.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PuffLoader />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        style={{
          backgroundImage:
            " linear-gradient(to right top, #f6e4ee, #f4e5f2, #f1e7f6, #eee8f9, #eaeafc, #e7edfe, #e5efff, #e3f2ff, #e4f6ff, #e6f9ff, #e9fcfe, #eefffe)",
        }}
        className="flex w-[80%] flex-col items-center py-1 px-8 "
      >
        <Button
          onClick={() => navigate("/")}
          label="Back"
          className="bg-[#f00f51] hover:bg-[#d1293d] my-5 w-[10%] relative right-[40%] "
        />
        <div className=" flex flex-col items-center mb-1">
          <img className="w-[40%] h-[70%]" src={Avatar} alt="Profile Image" />
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

          <div className="my-3">
            {!isFollowed ? (
              <Button
                className="bg-blue-600 hover:bg-blue-800 text-white"
                label="Follow"
                disabled={loading}
                onClick={() => handleFollow()}
              />
            ) : (
              <Button
                className="bg-blue-600 hover:bg-blue-800 text-white"
                label="Unfollow"
                disabled={loading}
                onClick={() => handleUnfollow()}
              />
            )}
          </div>
        </div>

        <div className="flex justify-center items-center my-4 flex-wrap ">
          {posts?.length > 0 &&
            posts?.map(
              (
                { _id, caption = "", description = "", image = "", likes },
                index
              ) => {
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
                          {likes?.length}{" "}
                          <i className="fa-regular fa-heart"></i>
                        </div>
                        {/* <div className="text-[12px]">
                          10.5k <i className="fa-solid fa-comment"></i>
                        </div>
                        <div className="text-[12px]">
                          10.5k <i className="fa-solid fa-share"></i>
                        </div> */}
                        <div className="text-[12px]">
                          10 <i className="fa-regular fa-bookmark"></i>
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

export default People;
