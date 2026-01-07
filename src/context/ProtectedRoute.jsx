import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Authcontext";


export const ProtectedRoute = ({ children }) => {
  const {isLoggedin}=useAuth();
  const location = useLocation();

  // CHECK THE TOKEN YOU ACTUALLY STORE
  const token = localStorage.getItem("adminToken");

  // ❌ Not logged in
  if (!isLoggedin) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // ✅ Logged in → allow access
  return children;
};
