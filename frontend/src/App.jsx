import FeedbackPage from "./pages/FeedbackPage";
import HomePage from "./pages/HomePage";
import NavigationMenuDemo from "@/components/TopNav/TopNav";
import { useState } from "react";
import "./App.css";
// import NotificationTabs from "./components/NotificationTabs/NotificationsTabs";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

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
        <NavigationMenuDemo setCurrentPage={setCurrentPage} />
        {/* <NotificationTabs ownerUserId="g0gWhxIqZCWrGzncO6At" /> */}
      </header>
      <main className="flex-grow p-4">{renderPage()}</main>
    </div>
  );
}

export default App;
