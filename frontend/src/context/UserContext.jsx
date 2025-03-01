import { fetchUsersByIds, emptyUser } from "../firebase/functions/fetchUsers";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usersList, setUsersList] = useState([]);
  const [currentUser, setCurrentUser] = useState(emptyUser);

  useEffect(() => {
    const userIds = [
      // "2z77IdGFK4Z12ruuYLnq",
      "it5S9yC8RtsKqFWLZAqk",
      // "ve4byKfBsDToVmSvrGKM",
      "aDodxmi0ldGUTqV1EK1D",
      "2uBmF6yNpHd6y25lLiIX",
    ];

    fetchUsersByIds(userIds).then((users) => {
      setUsersList(users);
      if (users.length > 0) {
        setCurrentUser(users[0]); // Set the first user as default
        console.log("User set:", users[0]);
      }
    });
  }, []);

  const handleUserLogin = (userId) => {
    const user = usersList.find((user) => user.id === userId);
    if (user) {
      setCurrentUser(user);
      console.log("Logged in as:", user);
    }
  };

  return (
    <UserContext.Provider value={{ usersList, currentUser, handleUserLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
