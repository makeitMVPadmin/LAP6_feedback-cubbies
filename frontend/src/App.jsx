import NotificationDrawer from "./components/NotificationDrawer/NotificationDrawer";
import {
  fetchUsersByIds,
  fetchUserById,
  emptyUser,
} from "./firebase/functions/fetchUsers";
// Import fetchUserById
import PortfolioDetailsPage from "./pages/PortfolioDetailsPage";
import HomePage from "./pages/HomePage";
import TopNav from "@/components/TopNav/TopNav";
import { useState, useEffect } from "react";
import { fetchUserBoosts } from "./firebase/functions/boostFunctionality";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentNavState, setCurrentSetNavState] = useState("home");
  const [lastPage, setLastPage] = useState("home");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [usersList, setUsersList] = useState([]); // Store all users
  const [currentUser, setCurrentUser] = useState(null); // Store logged-in user
  const [userBoosts, setUserBoosts] = useState([]);


  // Fetch specific users by their IDs on mount
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
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        setCurrentUser(usersList[0]); // Default to first user
      }
    }
  }, [usersList]);
  
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const handleUserLogin = async (userId) => {
    const user = usersList.find((user) => user.id === userId);
    console.log(user);
    if (user) {
      setCurrentUser(user);
      setUserBoosts([]); 
      console.log("Logged in as:", user);
      
      // Fetch boosts for the user
      const boosts = await fetchUserBoosts(user.id); 
      setUserBoosts(boosts); 
    }
  };
  
  // Handle navigation selection
  const handlePageChange = (page) => {
    if (page === "notifications") {
      setLastPage(currentPage);
      setIsDrawerOpen(true);
      setCurrentSetNavState("notifications");
    } else {
      setCurrentPage(page);
      setCurrentSetNavState(page);
    }
  };

  // Close the notifications drawer and restore the last page
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentPage(lastPage);
    setCurrentSetNavState(lastPage);
  };

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
          setCurrentPage={handlePageChange}
          currentPage={currentNavState}
          notificationCount="999"
          currentUser={currentUser || emptyUser}
          usersList={usersList}
          handleUserLogin={handleUserLogin}
        />
      </header>
      <main className="flex-grow p-4">{renderPage()}</main>

      {/* Notification Drawer */}
      <NotificationDrawer
        currentUser={currentUser || emptyUser}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

export default App;
