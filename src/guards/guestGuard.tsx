import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { PATHS } from "@/routes/paths";

const GuestGuard = ({ children }: { children: ReactNode }) => {
  const { role } = useAppSelector((state) => state.auth);

  if (role === "user") {
    return <Navigate to={PATHS.ABOUT} />;
  }
  if (role === "admin") {
    return <Navigate to={PATHS.DASHBOARD} replace={true} />;
  }

  return children;
};

export default GuestGuard;
