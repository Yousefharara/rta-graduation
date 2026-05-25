import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { PATHS } from "../routes/paths";
import { useAppSelector } from "../redux/store";

const GuestGuard = ({ children } : {children: ReactNode}) => {
  const { role } = useAppSelector((state) => state.auth);

  if (role === "user") {
    return <Navigate to={PATHS.ABOUT} />;
  }

  return children;
};

export default GuestGuard;
