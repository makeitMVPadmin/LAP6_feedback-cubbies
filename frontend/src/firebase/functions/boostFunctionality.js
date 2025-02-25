import { db } from "../firebase"; 
import { doc, setDoc, deleteDoc, collection, query, where, getDocs, increment, updateDoc, Timestamp } from "firebase/firestore";

// add boost (add boost to the portfolio)
const addBoost = async (portfolioId) => {
  try {
    const boostRef = doc(db, "boosts", `${portfolioId}_${Date.now()}`); 
    const createdAt = Timestamp.now();
    const updatedAt = createdAt; 
    const userId = localStorage.getItem("userId") || "defaultUserId";

    await setDoc(boostRef, { 
      portfolioId,
      createdAt,
      updatedAt,
      userId
    });

    await updatedBoostCount(portfolioId, 1); 
    console.log("Boost added");
  } catch (error) {
    console.error("Error adding boost:", error);
  }
};

// remove boost (remove boost from the portfolio)
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

// update the boost count for a given portfolio (increment or decrement)
const updatedBoostCount = async (portfolioId, incrementValue) => {
  const portfolioRef = doc(db, "portfolios", portfolioId);
  try {
    await updateDoc(portfolioRef, {
      boostCount: increment(incrementValue),
    });
  } catch (error) {
    console.error("Error updating boost count:", error);
  }
};

// check if a portfolio is boosted (check if the portfolio has any boost)
const checkIfBoosted = async (portfolioId) => {
  const boostRef = collection(db, "boosts");
  const q = query(boostRef, where("portfolioId", "==", portfolioId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length > 0; 
};

// fetch total boost count for a given portfolio
const fetchUserBoosts = async (portfolioId) => {
  const boostsRef = collection(db, "boosts");
  const q = query(boostsRef, where("portfolioId", "==", portfolioId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length; 
};

export { addBoost, removeBoost, checkIfBoosted, fetchUserBoosts };
