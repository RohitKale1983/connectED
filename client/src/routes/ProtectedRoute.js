import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
