import { db } from '../firebase'; // Ensure this is correctly imported
import { doc, setDoc, deleteDoc, collection, query, where, getDocs, increment } from 'firebase/firestore';

const addBoost = async (portfolioId, userId) => {
  try {
    const docRef = doc(db, "boosts", `${portfolioId}-${userId}`);
    await setDoc(docRef, { portfolioId, userId });
    const portfolioRef = doc(db, "portfolios", portfolioId);
    await setDoc(portfolioRef, { boostCount: increment(1) }, { merge: true });
    console.log("Boost added");
  } catch (error) {
    console.error("Error adding boost:", error);
  }
};

const removeBoost = async (boostId) => {
  try {
    await deleteDoc(doc(db, "boosts", boostId));
    console.log("Boost removed");
  } catch (error) {
    console.error("Error removing boost:", error);
  }
};

const updatedBoostCount = async (portfolioId, increment) => {
  try {
    const portfolioRef = doc(db, "portfolios", portfolioId);
    await setDoc(portfolioRef, { boostCount: increment(increment) }, { merge: true });
    console.log("Boost count updated");
  } catch (error) {
    console.error("Error updating boost count:", error);
  }
};

const checkIfBoosted = async (portfolioId, userId) => {
  const boostRef = collection(db, "boosts");
  const q = query(boostRef, where("portfolioId", "==", portfolioId), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].id : null; // Return boostId if boosted, else null
};

export { addBoost, removeBoost, updatedBoostCount, checkIfBoosted };
