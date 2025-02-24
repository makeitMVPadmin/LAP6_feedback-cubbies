import { addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";

// add a boost
const addBoost = async (portfolioId, userId) => {
    try{
        const boostRef = collection(db, "boosts");
        const newBoost = await addDoc(boostRef, {
            portfolioId,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })
        console.log("Boost added!")
    }catch(error){
        console.error("Error adding boost: ", error);
    }
};

// remove a boost
const removeBoost = async (boostId) => {
    try{
        await deleteDoc(doc(db, "boosts", boostId));
        console.log("Boost removed!");
    }catch(error){
        console.error("Error removing boost: ", error);
    }
};

// update the boost count on the posted portfolio
const updatedBoostCount = async (portfolioId, increment) => {
    try{
        const portfolioRef = doc(db, "portfolios", portfolioId);
        await updateDoc(portfolioRef, {
            boostCount: increment,
            updatedAt: serverTimestamp(),
        });
        console.log("Boost count updated!");
    }catch(error){
        console.error("Error updating boost count: ", error);
    }
}

// check if user already boosted the post
const checkIfBoosted = async (portfolioId, userId) => {
    const boostRef = collection(db, "boosts");
    const q = query(boostRef, where("portfolioId", "==", portfolioId), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].id : null; // Return boostId if boosted, else null
};

export { addBoost, removeBoost, updatedBoostCount, checkIfBoosted };