import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ allowedRoles, publicOnly = false }) => {
  const { user, isAuthenticated, authChecking, isLoading } = useSelector(
    (state) => state.auth,
  );

  const normalizedRole = user?.role?.toLowerCase();

  const getDefaultRoute = () => {
    if (normalizedRole === "admin") return "/admin";
    if (normalizedRole === "co-admin" || normalizedRole === "coadmin") return "/co-admin";
    return "/user-dashboard";
  };

  if (authChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-slate-700 dark:text-slate-200">
        Loading...
      </div>
    );
  }

  if (publicOnly) {
    if (isAuthenticated && user) {
      return <Navigate to={getDefaultRoute()} replace />;
    }

    return <Outlet />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(normalizedRole)) {
    return <Navigate to={getDefaultRoute()} replace />;
  }

  return <Outlet />;
};

export default ProtectRoute;