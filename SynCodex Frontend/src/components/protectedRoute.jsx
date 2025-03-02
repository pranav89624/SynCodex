import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api"; // Ensure this is configured to send credentials

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await API.get("/api/auth/protected", {
          headers: { Authorization: `Bearer ${token}` },
        }); // Backend route to verify authentication

        setIsAuthenticated(res.data ? true : false);
      } catch (error) {
        setIsAuthenticated(false);
        toast.error("Please login to access the dashboard!");
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>; // Show a loader while checking auth

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
