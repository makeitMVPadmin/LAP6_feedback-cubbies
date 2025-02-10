import { useEffect, useState } from "react";
import "./App.css";
import fetchUsers from "./firebase/functions/fetchUsers";
import { Button } from "./components/ui/button";
import HomeFeed from "./components/HomeFeed/HomeFeed";
import Post from "./components/Post/Post";

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
      <HomeFeed />
    </>
  );
}

export default App;
