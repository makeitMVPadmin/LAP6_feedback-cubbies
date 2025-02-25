import { createContext, useContext, useState } from "react";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentNavState, setCurrentNavState] = useState("home");
  const [portfolioId, setPortfolioId] = useState(null);

  // Navigate to Portfolio Details Page
  const goToProfileDetails = (id) => {
    setCurrentPage("feedback");
    setCurrentNavState("feedback");
    setPortfolioId(id);
  };

  // Navigate to Home Page
  const goToHome = () => {
    setCurrentPage("home");
    setCurrentNavState("home");
  };

  return (
    <NavigationContext.Provider
      value={{ currentPage, currentNavState, goToProfileDetails, goToHome, portfolioId, setPortfolioId }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
