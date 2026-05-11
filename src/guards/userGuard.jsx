import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { ROLES } from "../constants/roles";
import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "../routes/paths";

const UserGuard = () => {
  const { role } = useAuthContext();

  if (role === ROLES.USER) return <Outlet />;

  return <Navigate to={PATHS.AUTH.LOGIN} replace={true} />;
};

export default UserGuard;
