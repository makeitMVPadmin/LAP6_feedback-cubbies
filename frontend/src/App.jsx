import NotificationDrawer from "./components/NotificationDrawer/NotificationDrawer";
import {
  fetchUsersByIds,
  fetchUserById,
  emptyUser,
} from "./firebase/functions/fetchUsers";
// Import fetchUserById
import FeedbackPage from "./pages/FeedbackPage";
import HomePage from "./pages/HomePage";
import TopNav from "@/components/TopNav/TopNav";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentNavState, setCurrentSetNavState] = useState("home");
  const [lastPage, setLastPage] = useState("home");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [usersList, setUsersList] = useState([]); // Store all users
  const [currentUser, setCurrentUser] = useState(null); // Store logged-in user

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
      setCurrentUser(usersList[0]); // Set first user as logged in
      console.log("User set:", usersList[0]);
    }
  }, [usersList]);

  const handleUserLogin = (userId) => {
    const user = usersList.find((user) => user.id === userId);
    if (user) {
      setCurrentUser(user);
      console.log("Logged in as:", user);
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
        return <FeedbackPage currentUser={currentUser || emptyUser} />;
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
