import React, { useState } from "react";
import Input from "../../components/Input/Input.Component";
import Button from "../../components/Button/Button.Component";
import LoginImg from "../../assets/loginImg.jpeg";
import SignUp from "../../assets/signup.jpg";
import { useNavigate } from "react-router-dom";

const Form = ({ isSignInPage = false }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    ...(!isSignInPage && { username: "" }),
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:8000/api/${isSignInPage ? "login" : "register"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      }
    );
    // console.log(res, "res");
    if (res.status === 200 && isSignInPage) {
      const { user, token } = await res.json();
      localStorage.setItem("user:token", token);
      navigate("/");
    } else if (res.status !== 401) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="flex justify-center items-center ] h-screen w-full">
      <div className="flex justify-center items-center shadow-lg border h-[32rem] w-[45rem] bg-gray-50">
        <div
          style={{
            backgroundImage:" linear-gradient(to right top, #f6e4ee, #f4e5f2, #f1e7f6, #eee8f9, #eaeafc, #e7edfe, #e5efff, #e3f2ff, #e4f6ff, #e6f9ff, #e9fcfe, #eefffe)"
          }}
          className={`h-full w-full flex flex-col justify-center items-center p-0 ${
            !isSignInPage && "order-2"
          }`}
        >
          <div className="text-3xl">Welcome {isSignInPage && "Back"}</div>
          <div className="mb-10">
            Please {isSignInPage ? "Login" : "Register"} to Continue
          </div>
          <form onSubmit={(e) => handleSubmit(e)}>
            {!isSignInPage && (
              <Input
                label="Username"
                type="text"
                placeholder="Enter your Username"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="Enter your Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <Button
              className="bg-blue-700 px-5 my-2"
              label={isSignInPage ? "Login" : "Register"}
            />
            <div
              className="cursor-pointer text-blue-700 underline"
              onClick={() =>
                navigate(
                  `${isSignInPage ? "/account/register" : "/account/login"}`
                )
              }
            >
              {isSignInPage ? "Register Here" : "Login Here"}
            </div>
          </form>
        </div>
        <div
          className={`h-full w-full bg-white flex justify-center items-center border ${
            !isSignInPage && "order-1"
          }`}
        >
          {isSignInPage ? (
            <img
              src={LoginImg}
              className="object-fill h-[70%]"
              alt="Form images"
            />
          ) : (
            <img
              src={SignUp}
              className="object-fill w-[100%] h-[60%]"
              alt="Form images"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
