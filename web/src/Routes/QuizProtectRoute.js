import React from 'react'
import { Navigate } from 'react-router-dom';

export const QuizProtectRoute = ({children}) => {
    let authQno = sessionStorage.getItem("quiz_started");
    if (!authQno) {
      // user is not authenticated
      return <Navigate to="/introduction" />;
    }
    return children;
}
