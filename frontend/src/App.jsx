import { useEffect, useState } from "react";
import "./App.css";
import fetchPortfolio from "./firebase/functions/fetchPortfolio";
import fetchUsers from "./firebase/functions/fetchUsers";
import { Button } from "@/components/ui/button";

function App() {
  const [userData, setUsers] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUsers();
        setUsers(data);

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        const portfolio = await fetchPortfolio();
        setPortfolioData(portfolio);
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchData();
  }, []);
  return (
    <>
      <h1>Feedback Cubbies</h1>
      <Button>Click me</Button>

      <h2>Portfolio</h2>
      <ul>
        {portfolioData.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
