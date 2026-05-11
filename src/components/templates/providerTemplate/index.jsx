import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AuthProvider from "../../../context/AuthContext";

const ProviderTemplate = ({ children }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Template provider</title>
      </Helmet>
      <h2>Provider Template</h2>
      <AuthProvider>{children}</AuthProvider>
    </HelmetProvider>
  );
};

export default ProviderTemplate;
