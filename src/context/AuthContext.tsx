import React, { createContext, useContext, useEffect, useState } from "react";
import { ROLES } from "../constants/roles";


type Role = typeof ROLES[keyof typeof ROLES];

interface IAuthContextProvider {
  role: React.SetStateAction<Role>;
  setRole: React.Dispatch<React.SetStateAction<Role>>;
}

const defaultValue: IAuthContextProvider = {
  role: ROLES.GUEST,
  setRole: (prev: React.SetStateAction<Role>) => prev,
};


const AuthContext = createContext<IAuthContextProvider>(defaultValue);

const AuthProvider = ({ children } : {children: React.ReactNode}) => {
  const [role, setRole] = useState(ROLES.GUEST);

  useEffect(() => {
    console.log('in context, ', role);
  }, [role]);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext<IAuthContextProvider>(AuthContext);
  if (!context) throw new Error("Error");
  return context;
};

export default AuthProvider;
