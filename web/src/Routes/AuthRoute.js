import React from "react";
import { Navigate } from "react-router-dom"

export const AuthRoute = ({children}) => {
  let auth = sessionStorage.getItem("page");;
  if (!auth) {
    return <Navigate to="/" />;
  }

  return children;
};
