import { db } from "../firebase.js";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

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

const fetchUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = { id: userDoc.id, ...userDoc.data() };
      console.log(userData);
      return userData;
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user: ", error);
    return null;
  }
};

export default { fetchUsers, fetchUserById };
