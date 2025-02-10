import { db } from "../firebase.js";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

const getPortfolioFeedback = async (portfolioId) => {
  const feedbackQuery = query(
    collection(db, "feedback"),
    where("portfolioId", "==", portfolioId)
  );
  try {
    const feedbackSnapshot = await getDocs(feedbackQuery);
    const feedbackList = feedbackSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return feedbackList;
  } catch (err) {
    console.error("Error getting feedback: ", err);
    return [];
  }
};

const createFeedback = async (portfolioId, userId, comment) => {
  try {
    const docRef = await addDoc(collection(db, "feedback"), {
      portfolioId,
      userId,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef;
  } catch (err) {
    console.error("Error adding feedback: ", err);
    throw new Error("Failed to add feedback");
  }
};

const updateFeedback = async (feedbackId, newComment) => {
  const feedbackDoc = doc(db, "feedback", feedbackId);
  try {
    await updateDoc(feedbackDoc, {
      comment: newComment,
      updatedAt: new Date(),
    });
    console.log("Feedback updated successfully");
  } catch (err) {
    console.error("Error updating feedback: ", err);
  }
};

const deleteFeedback = async (feedbackId) => {
  const feedbackDoc = doc(db, "feedback", feedbackId);
  try {
    await deleteDoc(feedbackDoc);
    console.log("Feedback deleted successfully");
  } catch (err) {
    console.error("Error deleting feedback: ", err);
  }
};

export {
  getPortfolioFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};
