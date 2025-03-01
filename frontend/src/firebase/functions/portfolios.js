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
  orderBy
} from "firebase/firestore";

const fetchPortfolio = async () => {
  try {
    const q = query(collection(db, "portfolios"), orderBy("createdAt", "desc"), limit(3));
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
    const docRef = await addDoc(collection(db, "portfolios"), portfolioData);
    console.log("Portfolio added successfully!", docRef.id);
    return { id: docRef.id, ...portfolioData }; // Return an object with the ID
  } catch (error) {
    console.error("Error adding portfolio:", error);
    return null; // Return null to avoid undefined errors
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

      let userData = null;
      let roleData = { roleName: "Unknown" };

      if (portfolioData.userId) {
        const userId = portfolioData.userId;
        const userDoc = await getDoc(doc(db, "users", userId));

        if (userDoc.exists()) {
          userData = userDoc.data();

          const roleId = userData.roleId;
          const roleDoc = await getDoc(doc(db, "roles", roleId));

          if (roleDoc.exists()) {
            roleData = roleDoc.data();
          }
        } else {
          console.log("No such user with ID:", userId);
        }
      }

      let tags = [];
      if (portfolioData.tagId) {
        if (Array.isArray(portfolioData.tagId)) {
          const tagPromises = portfolioData.tagId.map((tagId) =>
            getDoc(doc(db, "tags", tagId))
          );
          const tagSnapshots = await Promise.all(tagPromises);

          tags = tagSnapshots.map((tagSnapshot) => {
            if (tagSnapshot.exists()) {
              return tagSnapshot.data().tagName;
            } else {
              console.log(`No tag found for ID: ${tagSnapshot.id}`);
              return "Unknown";
            }
          });
        } else {
          const tagSnapshot = await getDoc(
            doc(db, "tags", portfolioData.tagId)
          );
          if (tagSnapshot.exists()) {
            tags = [tagSnapshot.data().tagName];
          } else {
            console.log(`No tag found for ID: ${portfolioData.tagId}`);
            tags = ["Unknown"];
          }
        }
      }

      return {
        portfolio: { id: portfolioSnapshot.id, ...portfolioData },
        user: userData || { username: "Unknown", profilePhoto: "" },
        role: roleData,
        tags,
      };
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
