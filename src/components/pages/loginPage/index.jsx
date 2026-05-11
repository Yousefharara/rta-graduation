import React from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { ROLES } from "../../../constants/roles";

const LoginPage = () => {
  const { setRole } = useAuthContext();

  const handleLogin = () => {
    setRole(ROLES.USER);
  };

  return (
    <div>
      <h1 className=" bg-emerald-400 rounded-lg w-fit text-white p-8">
        Login Page
      </h1>
      <button
        onClick={handleLogin}
        className="border border-gray-200 rounded-lg py-2 w-fit m-4 cursor-pointer px-4"
      >
        Log in
      </button>
    </div>
  );
};

export default LoginPage;
