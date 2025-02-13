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
      setLastPage(currentPage);
      setCurrentPage("notifications");
      setIsDrawerOpen(true);
    } else {
      setCurrentPage(page);
    }
  };

  // Close the notifications drawer and restore the last page
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentPage(lastPage);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "feedback":
        return <FeedbackPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md p-4">
        <TopNav
          setCurrentPage={handlePageChange}
          currentPage={currentPage}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      </header>
      <main className="flex-grow p-4">{renderPage()}</main>

      {/*Close drawer restores previous page */}
      <NotificationDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
    </div>
  );
}

export default App;
