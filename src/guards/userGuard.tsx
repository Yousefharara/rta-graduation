import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "../routes/paths";
import { useAppSelector } from "../redux/store";

const UserGuard = () => {
  const { role } = useAppSelector((state) => state.auth);

  if (role === "user" || role === "admin") return <Outlet />;

  return <Navigate to={PATHS.AUTH.LOGIN} replace={true} />;
};

export default UserGuard;
