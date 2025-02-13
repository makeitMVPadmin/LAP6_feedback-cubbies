import FeedbackPage from "./pages/FeedbackPage";
import HomePage from "./pages/HomePage";
import TopNav from "@/components/TopNav/TopNav";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  // Ensure the navigation bar updates immediately on state change
  useEffect(() => {}, [currentPage]);

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
        {/* ✅ Pass currentPage to TopNav */}
        <TopNav setCurrentPage={setCurrentPage} currentPage={currentPage} />
      </header>
      <main className="flex-grow p-4">{renderPage()}</main>
    </div>
  );
}

export default App;
