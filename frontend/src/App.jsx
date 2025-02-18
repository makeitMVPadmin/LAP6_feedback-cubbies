import NotificationDrawer from "./components/NotificationDrawer/NotificationDrawer";
import FeedbackPage from "./pages/FeedbackPage";
import HomePage from "./pages/HomePage";
import TopNav from "@/components/TopNav/TopNav";
import { useState } from "react";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [lastPage, setLastPage] = useState("home");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handle navigation selection
  const handlePageChange = (page) => {
    if (page === "notifications") {
      setLastPage(currentPage); // Store last visited page
      setIsDrawerOpen(true); // Open notification drawer
    } else {
      setCurrentPage(page);
    }
  };

  // Close the notifications drawer and restore the last page
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentPage(lastPage); // Restore last visited page
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "feedback":
        return <FeedbackPage />;
      default:
        return <HomePage />; // Fallback
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md p-4">
        <TopNav
          setCurrentPage={handlePageChange}
          currentPage={currentPage}
          notificationCount="999"
          username="usernameTest"
        />
      </header>
      <main className="flex-grow p-4">
        {renderPage()} {/* Render current page */}
      </main>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
    </div>
  );
}

export default App;
