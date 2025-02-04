import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";

const fetchUsers = async (params) => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const userArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(userArray);
    return userArray;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
};
export default fetchUsers;
