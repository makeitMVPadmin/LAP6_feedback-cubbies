import { getDoc, deleteDoc, serverTimestamp, doc, updateDoc, } from "firebase/firestore";
import { db } from "../firebase.js";

// Add a boost 
const addBoost = async (portfolioId) => {
    try {
        // get the current portfolio to update boost count
        const portfolioRef = doc(db, "portfolios", portfolioId);
        const portfolioDoc = await getDoc(portfolioRef);

        if (portfolioDoc.exists()) {
            const currentBoostCount = portfolioDoc.data().boostCount || 0;

            // update boost count on the portfolio
            await updateDoc(portfolioRef, {
                boostCount: currentBoostCount + 1,
                updatedAt: serverTimestamp(),
            });
            console.log("Boost added!");
        }
    } catch (error) {
        console.error("Error adding boost: ", error);
    }
};

// Remove a boost
const removeBoost = async (portfolioId) => {
    try {
        // get the current portfolio to update boost count
        const portfolioRef = doc(db, "portfolios", portfolioId);
        const portfolioDoc = await getDoc(portfolioRef);

        if (portfolioDoc.exists()) {
            const currentBoostCount = portfolioDoc.data().boostCount || 0;

            if (currentBoostCount > 0) {
                await updateDoc(portfolioRef, {
                    boostCount: currentBoostCount - 1,
                    updatedAt: serverTimestamp(),
                });
                console.log("Boost removed!");
            } else {
                console.log("Boost count is already 0, can't remove further.");
            }
        }
    } catch (error) {
        console.error("Error removing boost: ", error);
    }
};

// update the boost count
const updatedBoostCount = async (portfolioId, increment) => {
    try {
        const portfolioRef = doc(db, "portfolios", portfolioId);
        const portfolioDoc = await getDoc(portfolioRef);

        if (portfolioDoc.exists()) {
            const currentBoostCount = portfolioDoc.data().boostCount || 0;

            // directly update the boost count
            await updateDoc(portfolioRef, {
                boostCount: currentBoostCount + increment,
                updatedAt: serverTimestamp(),
            });
            console.log("Boost count updated!");
        }
    } catch (error) {
        console.error("Error updating boost count: ", error);
    }
}

export { addBoost, removeBoost, updatedBoostCount };
