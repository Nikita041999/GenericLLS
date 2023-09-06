import { UserContext } from "lib/contexts/userContext";
import { useContext, useState,useEffect } from "react";
import { Navigate } from "react-router-dom";

// A wrapper for <Route> that redirects to the login

export const PlayerProtectedRoute = ({ children }) => {
  // const auth = useContext(UserContext);
  let auth = sessionStorage.getItem("player")
  if (!auth) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};

