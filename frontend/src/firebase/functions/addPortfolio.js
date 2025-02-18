import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const addPortfolio = async (portfolioData) => {
  try {
    await addDoc(collection(db, "portfolios"), portfolioData);
    console.log("Portfolio added successfully!");
  } catch (error) {
    console.error("Error adding portfolio:", error);
  }
};

export default addPortfolio;
