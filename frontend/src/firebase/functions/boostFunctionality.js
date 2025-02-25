import { db } from '../firebase'; // Ensure this is correctly imported
import { doc, setDoc, deleteDoc, collection, query, where, getDocs, increment } from 'firebase/firestore';

const addBoost = async (portfolioId, userId) => {
  try {
    const docRef = doc(db, "boosts", `${portfolioId}-${userId}`);
    await setDoc(docRef, { portfolioId, userId });
    await updatedBoostCount(portfolioId, 1);
    console.log("Boost added");
  } catch (error) {
    console.error("Error adding boost:", error);
  }
};

const removeBoost = async (boostId) => {
  try {
    await deleteDoc(doc(db, "boosts", boostId));
    await updatedBoostCount(boostId.split("-")[0], -1); // Decrease boost count for portfolio
    console.log("Boost removed");
  } catch (error) {
    console.error("Error removing boost:", error);
  }
};

const checkIfBoosted = async (portfolioId, userId) => {
  const boostRef = collection(db, "boosts");
  const q = query(boostRef, where("portfolioId", "==", portfolioId), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].id : null; // Return boostId if boosted, else null
};

const fetchUserBoosts = async (userId) => {
  const boostsRef = collection(db, "boosts");
  const q = query(boostsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const boosts = querySnapshot.docs.map((doc) => doc.data());
  return boosts; // Return boost data
};

export { addBoost, removeBoost, checkIfBoosted, fetchUserBoosts };
