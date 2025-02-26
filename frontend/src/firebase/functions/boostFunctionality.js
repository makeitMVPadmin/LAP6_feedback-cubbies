import { db } from "../firebase";
import { 
  doc, setDoc, deleteDoc, collection, 
  query, where, getDocs, increment, 
  updateDoc, Timestamp, getDoc 
} from "firebase/firestore";

// add boost (user-specific boost)
const addBoost = async (portfolioId, userId) => {
  console.log("Adding Boost - Portfolio ID:", portfolioId, "User ID:", userId);

  if (!userId) {
    console.error("User ID is missing.");
    return;
  }

  try {
    // Check if the user has already boosted the portfolio
    const boostQuery = query(
      collection(db, "boosts"),
      where("portfolioId", "==", portfolioId),
      where("userId", "==", userId)
    );
    const boostSnapshot = await getDocs(boostQuery);

    console.log("Boost Snapshot Size:", boostSnapshot.size);

    if (!boostSnapshot.empty) {
      console.log("User has already boosted this portfolio.");
      return;
    }

    // Add a new boost document with createdAt and updatedAt
    const boostRef = doc(db, "boosts", `${portfolioId}_${userId}`);
    console.log("Document Path:", boostRef.path);

    await setDoc(boostRef, {
      portfolioId,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Update the boost count in the portfolio
    await updatedBoostCount(portfolioId, 1);
    console.log("Boost added successfully.");
  } catch (error) {
    console.error("Error adding boost:", error);
  }
};

// remove boost (only the user's boost)
const removeBoost = async (portfolioId, userId) => {
  if (!userId) {
    console.error("User ID is missing.");
    return;
  }

  try {
    // Query to find the user's boost
    const boostQuery = query(
      collection(db, "boosts"),
      where("portfolioId", "==", portfolioId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(boostQuery);

    if (!querySnapshot.empty) {
      const boostDoc = querySnapshot.docs[0];
      console.log("Boost document ID to remove:", boostDoc.id);

      // Delete the boost document
      await deleteDoc(doc(db, "boosts", boostDoc.id));

      // Decrement the boost count
      await updatedBoostCount(portfolioId, -1);
      console.log("Boost removed successfully.");
    } else {
      console.log("No boost found for this user.");
    }
  } catch (error) {
    console.error("Error removing boost:", error);
  }
};

// update boost count efficiently
const updatedBoostCount = async (portfolioId, incrementValue) => {
  try {
    const portfolioRef = doc(db, "portfolios", portfolioId);
    await updateDoc(portfolioRef, { boostCount: increment(incrementValue) });
    console.log(`Boost count updated for ${portfolioId} by ${incrementValue}`);
  } catch (error) {
    console.error("Error updating boost count:", error);
  }
};

// check if a user has boosted this portfolio
const checkIfBoosted = async (portfolioId, userId) => {
  if (!userId) return false;

  try {
    const boostQuery = query(
      collection(db, "boosts"),
      where("portfolioId", "==", portfolioId),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(boostQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking boost:", error);
    return false;
  }
};

// fetch total boost count from the portfolio post
const fetchBoostCount = async (portfolioId) => {
  try {
    const portfolioRef = doc(db, "portfolios", portfolioId);
    const portfolioSnap = await getDoc(portfolioRef); 
    
    if (portfolioSnap.exists()) {
      return portfolioSnap.data().boostCount || 0;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error fetching boost count:", error);
    return 0;
  }
};

export { addBoost, removeBoost, checkIfBoosted, updatedBoostCount, fetchBoostCount };
