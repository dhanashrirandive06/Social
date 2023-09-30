import React from "react";
import Form from "./Form.Page";

const Auth = () => {
  const isSignInPage = window.location.pathname.includes(["login"]);
  return <Form isSignInPage={isSignInPage} />;
};

export default Auth;
