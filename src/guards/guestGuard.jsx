import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { ROLES } from "../constants/roles";
import { Navigate } from "react-router-dom";
import { PATHS } from "../routes/paths";

const GuestGuard = ({ children }) => {
  const { role } = useAuthContext();

  if (role === ROLES.USER) {
    return <Navigate to={PATHS.ABOUT} />;
  }

  return children;
};

export default GuestGuard;
