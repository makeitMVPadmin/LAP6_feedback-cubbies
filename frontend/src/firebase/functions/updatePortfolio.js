import { db } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const updatePortfolio = async (id, updatedData) => {
  try {
    console.log("Updating Portfolio ID:", id);
    const portfolioRef = doc(db, "portfolios", id);
    await updateDoc(portfolioRef, updatedData);
    console.log("Portfolio updated successfully!");
  } catch (error) {
    console.error("Error updating portfolio:", error);
  }
};
export default updatePortfolio;
