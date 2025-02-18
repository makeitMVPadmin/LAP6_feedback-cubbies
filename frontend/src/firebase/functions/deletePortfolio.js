import { db } from "../../firebase/firebase";
import { doc, deleteDoc } from "firebase/firestore";

const deletePortfolio = async (id) => {
  try {
    await deleteDoc(doc(db, "portfolios", id));
    console.log("Portfolio deleted successfully!");
  } catch (error) {
    console.error("Error deleting portfolio:", error);
  }
};

export default deletePortfolio;
