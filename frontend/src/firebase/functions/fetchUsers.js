import { db } from "../firebase.js";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export const fetchUsers = async (params) => {
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

// export const fetchUserById = async (userId) => {
//   try {
//     const userDoc = await getDoc(doc(db, "users", userId));
//     if (userDoc.exists()) {
//       const userData = { id: userDoc.id, ...userDoc.data() };
//       console.log(userData);
//       return userData;
//     } else {
//       console.log("No such user!");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching user: ", error);
//     return null;
//   }
// };

export const fetchUserById = async (userId) => {
  try {
    // check if userId is missing
    if (!userId) {
      throw new Error("fetchUserById called without a valid userId");
    }

    const userDoc = await getDoc(doc(db, "users", userId));

    if (userDoc.exists()) {
      const userData = { id: userDoc.id, ...userDoc.data() };
      console.log(userData);
      
      // make sure arrays of user data are valid
      if (!userData.someArrayField) {
        userData.someArrayField = []; 
      }

      return userData;
    } else {
      console.log("No such user!");
      return null; // return null if the user doesn't exist
    }
  } catch (error) {
    console.error("Error fetching user: ", error);
    return null; // return null if an error occurs
  }
};

export const fetchUsersByIds = async (userIds) => {
  try {
    const userPromises = userIds.map(async (userId) => {
      const userDoc = await getDoc(doc(db, "users", userId));
      return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
    });

    const usersList = (await Promise.all(userPromises)).filter(
      (user) => user !== null
    );
    console.log(usersList); // List of user objects
    return usersList;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
};

export const emptyUser = {
  id: null, // Primary key (integer)
  username: "", // String (varchar)
  roleId: null, // Foreign key reference to roles.id
  city: "", // String
  country: "", // String
  state: "", // String
  discipline: "", // String
  interests: [], // Array of strings
  email: "", // String
  firstName: "", // String
  lastName: "", // String
  profilePhoto: "", // String (URL to profile picture)
  createdAt: null, // Timestamp
  updatedAt: null, // Timestamp
};
