import { UserContext } from "lib/contexts/userContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

// A wrapper for <Route> that redirects to the login

export const UnProtectedRoute = ({ children }) => {
  const auth = useContext(UserContext);
  if (auth.user) {
    // user is not authenticated
    return <Navigate to="/introduction" />;
  }
  return children;
};
