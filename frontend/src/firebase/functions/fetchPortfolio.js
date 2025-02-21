import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";

const fetchPortfolio = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "portfolio"));
    const userPortfolio = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(userPortfolio);
    return userPortfolio;
  } catch (error) {
    console.error("Error fetching portfolio: ", error);
    return [];
  }
};

export default fetchPortfolio;
