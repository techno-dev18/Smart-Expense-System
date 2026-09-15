import { Navigate, Outlet, useLocation } from "react-router-dom";

import Loading from "./Loading";

import { useAuth } from "../context/AuthContext";


function ProtectedRoute({
  children,
}) {

  const {
    user,
    token,
    loading,
  } = useAuth();

  const location =
    useLocation();


  // ==========================================
  // AUTHENTICATION LOADING
  // ==========================================

  if (loading) {
    return (
      <Loading
        message="Checking authentication..."
      />
    );
  }


  // ==========================================
  // NOT AUTHENTICATED
  // ==========================================

  if (!token || !user) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );

  }


  // ==========================================
  // AUTHENTICATED
  // ==========================================

  if (children) {
    return children;
  }


  return <Outlet />;
}


export default ProtectedRoute;