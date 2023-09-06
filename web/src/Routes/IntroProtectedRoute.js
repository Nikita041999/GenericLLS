import React from 'react'
import { Navigate } from 'react-router-dom';

const IntroProtectedRoute = ({children}) => {
    let auth = sessionStorage.getItem("player");
    if (!auth) {
      // user is not authenticated
    //   return <Navigate to="/quiz" />;
    // }else if(auth){
      return <Navigate to="/signup" />;
    }
  
    return children;
}

export default IntroProtectedRoute