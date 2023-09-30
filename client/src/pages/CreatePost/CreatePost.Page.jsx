import React, { useState } from "react";
import Input from "../../components/Input/Input.Component";
import Button from "../../components/Button/Button.Component";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [data, setData] = useState({
    caption: "",
    desc: "",
    img: "",
  });

  const navigate = useNavigate();
  const [url, setUrl] = useState("");

  const uploadImg = async () => {
    const formData = new FormData();
    formData.append("file", data.img);
    formData.append("upload_preset", "social-media");
    formData.append("cloud_name", "dmlzxft98");
    const res = await fetch(
      ` https://api.cloudinary.com/v1_1/dmlzxft98/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.status === 200) {
      console.log("In url return");
      return await res.json();
      //   console.log(secureUrl, "secureUrl");
    } else {
      return "error";
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data Img", data.img);
    const res = await uploadImg();
    console.log(res.secure_url);
    setUrl(res.secure_url);
    console.log("begore getch");
    const dbRes = await fetch(`http://localhost:8000/api/new-post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user:token")}`,
      },
      body: JSON.stringify({
        caption: data.caption,
        desc: data.desc,
        url: res.secure_url,
      }),
    });
    console.log("status check");
    if (dbRes.status === 200) {
      navigate("/");
    } else {
      console.log("Error");
    }
  };

  const label = `${(<i class="fa-solid fa-reply"></i>)} Back`;
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Button
        onClick={() => navigate("/")}
        label={`Back`}
        className="bg-[#f00f51] hover:bg-[#d1293d] my-5 w-[10%] relative right-[15%] "
      />
      <div
        style={{
          backgroundImage:
            " linear-gradient(to right top, #f6e4ee, #f4e5f2, #f1e7f6, #eee8f9, #eaeafc, #e7edfe, #e5efff, #e3f2ff, #e4f6ff, #e6f9ff, #e9fcfe, #eefffe)",
        }}
        className="h-[35rem] w-[40rem] border p-6 flex flex-col items-center rounded-lg shadow-lg"
      >
        <div className="text-3xl text-blue-950 font-medium rounded-lg p-2 m-2 ">
          Create New Post
        </div>
        <form
          className="w-full flex flex-col items-center"
          onSubmit={(e) => handleSubmit(e)}
        >
          <Input
            name="title"
            className="py-4"
            placeholder="Caption..."
            value={data.caption}
            isRequired={true}
            onChange={(e) => setData({ ...data, caption: e.target.value })}
          />
          <textarea
            rows={5}
            className="w-full border shadow p-2 resize-none focus:outline-none"
            placeholder="Description..."
            value={data.desc}
            required
            onChange={(e) => setData({ ...data, desc: e.target.value })}
          />
          <div className="my-4">
            <Input
              type="file"
              name="image"
              className="p-4 hidden"
              isRequired={false}
              onChange={(e) => setData({ ...data, img: e.target.files[0] })}
            />
            <label
              className="cursor-pointer border w-full p-2 rounded-sm shadow bg-white"
              htmlFor="image"
            >
              {data?.img?.name || "Upload image"}
            </label>
          </div>
          <Button
            type="submit"
            label="Create Post"
            className="bg-[#f00f51] hover:bg-[#d1293d] my-5 w-[40%]"
          />
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
