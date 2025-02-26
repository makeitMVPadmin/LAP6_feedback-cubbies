import { createContext, useContext, useState } from "react";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentNavState, setCurrentNavState] = useState("home");
  const [portfolioId, setPortfolioId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  // Open and Close Notification Drawer
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        currentNavState,
        goToProfileDetails,
        goToHome,
        portfolioId,
        setPortfolioId,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
