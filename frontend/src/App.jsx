import Comments from "./pages/CommentsPage";
import HomePage from "./pages/HomePage";
import NavigationMenuDemo from "@/components/TopNav/TopNav";
import { Button } from "@/components/ui/button";
import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import fetchPortfolio from "./firebase/functions/fetchPortfolio";
import fetchUsers from "./firebase/functions/fetchUsers";

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
            <link to="/FetchPortfolio">
              <Button coclick>Review Portfolio</Button>
            </link>

            {/* Define Routes */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/comments" element={<Comments />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
