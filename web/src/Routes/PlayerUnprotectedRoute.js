import React from "react";
import { Navigate } from "react-router-dom"

export const PlayerUnprotectedRoute = ({children}) => {
  // const auth = useContext(UserContext);
  let auth = sessionStorage.getItem("player");
  // let authQno = sessionStorage.getItem("q_no");
  if (auth) {
    // user is not authenticated
  //   return <Navigate to="/quiz" />;
  // }else if(auth){
    return <Navigate to="/introduction" />;
  }

  return children;
};
