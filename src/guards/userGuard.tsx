import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { PATHS } from "@/routes/paths";

const UserGuard = () => {
  const { role } = useAppSelector((state) => state.auth);

  if (role === "beneficiary") return <Outlet />;

  return <Navigate to={PATHS.AUTH.LOGIN} replace={true} />;
};

export default UserGuard;
