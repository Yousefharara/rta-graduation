import React from "react";
import { ROLES } from "../constants/roles";
import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "../routes/paths";
import { useAppSelector } from "../redux/store";

const UserGuard = () => {
  const { role } = useAppSelector((state) => state.auth);

  if (role === ROLES.USER) return <Outlet />;

  return <Navigate to={PATHS.AUTH.LOGIN} replace={true} />;
};

export default UserGuard;
