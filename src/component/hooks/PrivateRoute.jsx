import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const [authState, setAuthState] = useState({ isLoggedin: false, role: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");

    if (id && role) {
      setAuthState({ isLoggedin: true, role });
    }
    setLoading(false);
  }, []);

  return { ...authState, loading };
};

export const PrivateRoute = ({ allowedRoles }) => {
  const auth = useAuth();

  if (auth.loading) {
    return <h1>Loading...</h1>;
  }

  if (!auth.isLoggedin) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
