import { useEffect, useState } from "react";
import "./App.css";
import fetchUsers from "./firebase/functions/fetchUsers";
import { Button } from "./components/ui/button";
import HomeFeed from "./components/HomeFeed/HomeFeed";
import { Link } from "lucide-react";

function App() {
  const [userData, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchData();
  }, []);
  return (
    <>
      <h1>Feedback Cubbies</h1>
      <Button text="click me" variant="secondary" />
      <Button variant="link">Click me</Button>


      <HomeFeed />
    </>
  );
}

export default App;
