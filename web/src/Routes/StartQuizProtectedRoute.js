import React from 'react'
import { Navigate } from 'react-router-dom';

const StartQuizProtectedRoute = ({children}) => {
    let auth = sessionStorage.getItem("page")
    if (!auth) {
      // user is not authenticated
      return <Navigate to="/signup" />;
    }else{

    }
    return children;
}

export default StartQuizProtectedRoute