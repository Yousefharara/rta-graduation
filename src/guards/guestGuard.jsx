import React from "react";
import { ROLES } from "../constants/roles";
import { Navigate } from "react-router-dom";
import { PATHS } from "../routes/paths";
import { useAppSelector } from "../redux/store";

const GuestGuard = ({ children }) => {
  const { role } = useAppSelector((state) => state.auth);

  if (role === ROLES.USER) {
    return <Navigate to={PATHS.ABOUT} />;
  }

  return children;
};

export default GuestGuard;
