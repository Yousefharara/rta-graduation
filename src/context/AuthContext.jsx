import React, { createContext, useContext, useEffect, useState } from "react";
import { ROLES } from "../constants/roles";

const AuthContext = createContext(ROLES.GUEST);

const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(ROLES.GUEST);

  useEffect(() => {
    console.log('in context, ', role);
  })

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Error");
  return context;
};

export default AuthProvider;
