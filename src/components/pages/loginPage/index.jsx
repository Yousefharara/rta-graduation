import React from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { ROLES } from "../../../constants/roles";

const LoginPage = () => {


  const { setRole } = useAuthContext();

  const handleLogin = () => {
    setRole(ROLES.USER);
  };

  return (
    <section>

    </section>
  );
};

export default LoginPage;

