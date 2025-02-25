import { db } from "../firebase"; 
import { doc, setDoc, deleteDoc, collection, query, where, getDocs, FieldValue } from "firebase/firestore";

const addBoost = async (portfolioId) => {
  try {
    // Generate a unique boost reference
    const boostRef = doc(db, "boosts", portfolioId); // change this later if the userId ends up working
    await setDoc(boostRef, { portfolioId });

    await updatedBoostCount(portfolioId, 1);
    console.log("Boost added");
  } catch (error) {
    console.error("Error adding boost:", error);
  }
};

const removeBoost = async (portfolioId) => {
  try {
    const boostRef = collection(db, "boosts");
    const q = query(boostRef, where("portfolioId", "==", portfolioId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const boostDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, "boosts", boostDoc.id));
      await updatedBoostCount(portfolioId, -1);
      console.log("Boost removed");
    }
  } catch (error) {
    console.error("Error removing boost:", error);
  }
};

const updatedBoostCount = async (portfolioId, incrementValue) => {
  const portfolioRef = doc(db, "portfolios", portfolioId);
  await setDoc(portfolioRef, {
    boostCount: FieldValue.increment(incrementValue), 
  }, { merge: true });
};

const checkIfBoosted = async (portfolioId) => {
  const boostRef = collection(db, "boosts");
  const q = query(boostRef, where("portfolioId", "==", portfolioId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].id : null; 
};

const fetchUserBoosts = async (portfolioId) => {
  const boostsRef = collection(db, "boosts");
  const q = query(boostsRef, where("portfolioId", "==", portfolioId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length;
};

export { addBoost, removeBoost, checkIfBoosted, fetchUserBoosts };
