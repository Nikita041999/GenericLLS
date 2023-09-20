import React from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "lib/contexts/adminContext";

export const AdminProtectedRoute = ({children}) => {
   // const auth = useContext(UserContext);
   let auth = localStorage.getItem("admin")
   if (!auth) {
     // user is not authenticated
     return <Navigate to="/" />;
   }
   return children;
};
