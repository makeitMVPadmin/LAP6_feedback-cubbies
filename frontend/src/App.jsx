import Comments from "./pages/Comments";
import Home from "./pages/Home";
import NavigationMenuDemo from "@/components/TopNav/TopNav";
import { Button } from "@/components/ui/button";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
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
            <Route path="/" element={<Home />} />
            <Route path="/comments" element={<Comments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
