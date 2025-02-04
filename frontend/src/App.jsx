import { useEffect, useState } from "react";
import "./App.css";
import fetchUsers from "./firebase/functions/fetchUsers";

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
    </>
  );
}

export default App;
