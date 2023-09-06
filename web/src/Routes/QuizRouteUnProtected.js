import React from "react";
import { Navigate } from "react-router-dom";

const QuizRouteUnProtected = ({ children }) => {
  // const auth = useContext(UserContext);
  let auth = sessionStorage.getItem("quiz_started");
  // let authQno = sessionStorage.getItem("q_no");
  if (auth) {
    return <Navigate to="/quiz" />;
  }

  return children;
};

export default QuizRouteUnProtected;
