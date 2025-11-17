import React, { createContext, useState, useContext } from "react";

// Create Context
const CompanyContext = createContext();

// Custom Hook for easy access
export const useCompany = () => useContext(CompanyContext);

// Context Provider Component
export const CompanyProvider = ({ children }) => {
  const [companyCode, setCompanyCode] = useState(null);

  return (
    <CompanyContext.Provider value={{ companyCode, setCompanyCode }}>
      {children}
    </CompanyContext.Provider>
  );
};
