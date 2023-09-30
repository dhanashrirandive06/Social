import React from "react";
import Home from "../pages/Home/Home.Page";
import Auth from "../pages/Auth/Auth.Page";
import { Navigate, Routes, Route } from "react-router-dom";
import CreatePost from "../pages/CreatePost/CreatePost.Page";
import Profile from "../pages/Profile/Profile.Page";
import People from "../pages/People/People.Page";

const ProtectedRoute = ({ children }) => {
  const isUserLoggedIn = window.localStorage.getItem("user:token") || false;
  const isFormPages = window.location.pathname.includes("account");

  if (isUserLoggedIn && !isFormPages) {
    return children;
  } else if (!isUserLoggedIn && isFormPages) {
    return children;
  } else {
    const redirectUrl = isUserLoggedIn ? "/" : "/account/login";
    return <Navigate to={redirectUrl} replace />;
  }
};

const routes = () => {
  const router = [
    {
      id: 1,
      name: "home",
      path: "/",
      Component: <Home />,
    },
    {
      id: 2,
      name: "login",
      path: "/account/login",
      Component: <Auth />,
    },
    {
      id: 3,
      name: "register",
      path: "/account/register",
      Component: <Auth />,
    },
    {
      id: 4,
      name: "createPost",
      path: "/new-post",
      Component: <CreatePost />,
    },
    {
      id: 5,
      name: "my profile",
      path: "/profile",
      Component: <Profile />,
    },
    {
      id: 6,
      name: "people",
      path: "/user/:username",
      Component: <People />,
    },
  ];
  return (
    <Routes>
      {router.map(({ id, name, path, Component }) => {
        return (
          <Route
            exact
            path={path}
            element={<ProtectedRoute>{Component}</ProtectedRoute>}
            key={id}
          />
        );
      })}
    </Routes>
  );
};

export default routes;
