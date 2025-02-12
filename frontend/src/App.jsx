import HomePage from "./pages/HomePage";
import NavigationMenuDemo from "@/components/TopNav/TopNav";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import FeedbackPage from "./pages/FeedbackPage";
import NotificationsPage from "./pages/NotificationsPage";

function App() {
  return (
    <>
      <Router>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-md p-4">
            <NavigationMenuDemo />
          </header>
          <main className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
