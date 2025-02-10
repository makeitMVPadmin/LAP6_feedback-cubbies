import { useEffect, useState } from "react";
import "./App.css";
import fetchUsers from "./firebase/functions/fetchUsers";
import { Button } from "@/components/ui/button";
import Feedback from "./components/Feedback/Feedback";

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
      <Button>Click me</Button>
      <Feedback />
    </>
  );
}

export default App;
