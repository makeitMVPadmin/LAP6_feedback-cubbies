import HomePage from "./pages/HomePage";
import NavigationMenuDemo from "@/components/TopNav/TopNav";
import { Button } from "@/components/ui/button";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import FeedbackPage from "./pages/FeedbackPage";

function App() {
  return (
    <>
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-md p-4">
          <NavigationMenuDemo />
        </header>
        <main className="flex-grow p-4">
          <h1>Feedback Cubbies</h1>
          <Button>Click me</Button>

          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
          </Routes>
        </main>
      </div>
    </Router>
    </>
  );
}

export default App;
