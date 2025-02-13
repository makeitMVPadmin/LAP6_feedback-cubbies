import NotificationDrawer from "./components/NotificationDrawer/NotificationDrawer";
import FeedbackPage from "./pages/FeedbackPage";
import HomePage from "./pages/HomePage";
import TopNav from "@/components/TopNav/TopNav";
import { useState } from "react";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      {/* Top Navigation Bar in Header */}
      <header className="bg-white shadow-md p-4">
        <TopNav
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      </header>

      {/* Page Content in Body */}
      <main className="flex-grow p-4">
        {renderPage()}
        <NotificationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </main>
    </div>
  );
}

export default App;
