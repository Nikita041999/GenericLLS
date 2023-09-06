import React from 'react'
import { Navigate } from "react-router-dom"

const StartQuizUnProtectedRoute = ({children}) => {
    let auth = sessionStorage.getItem("page");
    // let authQno = sessionStorage.getItem("q_no");
    if (auth) {
      // user is not authenticated
    //   return <Navigate to="/quiz" />;
    // }else if(auth){
      return <Navigate to="/signup" />;
    }

    return children
}

export default StartQuizUnProtectedRoute