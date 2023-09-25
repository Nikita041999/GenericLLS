import React, { useContext } from 'react'
import { AdminContext } from 'lib/contexts/adminContext';
import { Navigate } from "react-router-dom";

const AdminUnProtextedRoute = ({children}) => {
    const auth = useContext(AdminContext);
    if (auth.admin) {
      // user is not authenticated
      return <Navigate to="/players" />;
    }
    return children;
}

export default AdminUnProtextedRoute