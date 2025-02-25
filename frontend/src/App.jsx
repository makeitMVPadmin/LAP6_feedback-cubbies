import NotificationDrawer from "./components/NotificationDrawer/NotificationDrawer";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import { fetchUsersByIds, emptyUser } from "./firebase/functions/fetchUsers";
import HomePage from "./pages/HomePage";
import PortfolioDetailsPage from "./pages/PortfolioDetailsPage";
import TopNav from "@/components/TopNav/TopNav";
import { useState, useEffect } from "react";
import "./App.css";
import { Toaster } from "sonner";

function AppContent() {
  const {
    currentPage,
    goToProfileDetails,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useNavigation();
  const [usersList, setUsersList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userIds = [
      "01x5EDdS2TlLNMPLkiPT",
      "03E7eZ9ODHyBiguPGXtw",
      "0U4AlgjUcfgyC23raMTo",
    ];

    fetchUsersByIds(userIds).then((users) => {
      setUsersList(users);
    });
  }, []);

  useEffect(() => {
    if (usersList.length > 0 && !currentUser) {
      setCurrentUser(usersList[0]);
      console.log("User set:", usersList[0]);
    }
  }, [usersList]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage currentUser={currentUser || emptyUser} />;
      case "feedback":
        return <PortfolioDetailsPage currentUser={currentUser || emptyUser} />;
      default:
        return <HomePage currentUser={currentUser || emptyUser} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md p-4">
        <TopNav
          currentPage={currentPage}
          notificationCount="999"
          currentUser={currentUser || emptyUser}
          usersList={usersList}
          openDrawer={openDrawer} // Pass function to TopNav
        />
      </header>
      <main className="flex-grow p-4">{renderPage()}</main>

      {/* Notification Drawer */}
      <NotificationDrawer
        currentUser={currentUser || emptyUser}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
    </div>
  );
}

function App() {
  return (
    <>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
      <div className="min-h-screen flex flex-col">
        <Toaster position="bottom-right" richColors />
      </div>
    </>
  );
}

export default App;
