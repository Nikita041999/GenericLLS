import { UserContext } from "lib/contexts/userContext";
import { useContext, useState,useEffect } from "react";
import { Navigate } from "react-router-dom";

// A wrapper for <Route> that redirects to the login

export const ProtectedRoute = ({ children }) => {
  // const auth = useContext(UserContext);
  let auth = localStorage.getItem("user")
  if (!auth) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};
