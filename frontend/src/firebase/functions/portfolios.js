import { db } from "../../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  limit,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const fetchPortfolio = async () => {
  try {
    const q = query(collection(db, "portfolios"), limit(3));
    const querySnapshot = await getDocs(q);

    const userPortfolio = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched portfolios:", userPortfolio);
    return userPortfolio;
  } catch (error) {
    console.error("Error fetching portfolios: ", error);
    return [];
  }
};

const addPortfolio = async (portfolioData) => {
  try {
    await addDoc(collection(db, "portfolios"), portfolioData);
    console.log("Portfolio added successfully!");
  } catch (error) {
    console.error("Error adding portfolio:", error);
  }
};

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

const deletePortfolio = async (id) => {
  try {
    await deleteDoc(doc(db, "portfolios", id));
    console.log("Portfolio deleted successfully!");
  } catch (error) {
    console.error("Error deleting portfolio:", error);
  }
};

const getPortfolioById = async (portfolioId) => {
  try {
    const portfolioDoc = doc(db, "portfolios", portfolioId);
    const portfolioSnapshot = await getDoc(portfolioDoc);

    if (portfolioSnapshot.exists()) {
      const portfolioData = portfolioSnapshot.data();

      if (portfolioData.userId) {
        const userId = portfolioData.userId;
        const userDoc = await getDoc(doc(db, "users", userId));

        if (!userDoc.exists()) {
          console.log("No such user with ID:", userId);
          return null;
        }

        const userData = userDoc.data();

        const roleId = userData.roleId;
        const roleDoc = await getDoc(doc(db, "roles", roleId));

        const roleData = roleDoc.exists()
          ? roleDoc.data()
          : { roleName: "Unknown" };

        return {
          portfolio: { id: portfolioSnapshot.id, ...portfolioData },
          user: userData,
          role: roleData,
        };
      } else {
        console.log("No userId found in the portfolio.");
        return {
          portfolio: { id: portfolioSnapshot.id, ...portfolioData },
          user: { username: "Unknown", profilePhoto: "" },
          role: { roleName: "Unknown" },
        };
      }
    } else {
      console.log("No such portfolio with ID:", portfolioId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching portfolio by ID:", error);
    return null;
  }
};

export {
  fetchPortfolio,
  addPortfolio,
  updatePortfolio,
  deletePortfolio,
  getPortfolioById,
};
