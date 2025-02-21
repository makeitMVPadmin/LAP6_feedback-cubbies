import { db } from "../firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

const getPortfolioFeedback = async (portfolioId) => {
  const feedbackQuery = query(
    collection(db, "feedbacks"),
    where("portfolio_id", "==", portfolioId)
  );
  try {
    const feedbackSnapshot = await getDocs(feedbackQuery);
    const feedbackList = [];

    for (const docSnapshot of feedbackSnapshot.docs) {
      const feedbackData = docSnapshot.data();
      const userId = feedbackData.user_id;

      const userDoc = await getDoc(doc(db, "users", userId));
      const userData = userDoc.exists() ? userDoc.data() : { user_name: "Unknown", user_profilePicture: "" };
      console.log(userData);

      feedbackList.push({
        id: doc.id,
        ...feedbackData,
        user_name: userData.username,
        user_profilePicture: userData.profile_photo,
      });
    }

    return feedbackList;
  } catch (err) {
    console.error("Error getting feedback: ", err);
    return [];
  }
};

const createFeedback = async (portfolioId, userId, comment) => {
  try {
    const docRef = await addDoc(collection(db, "feedbacks"), {
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
  const feedbackDoc = doc(db, "feedbacks", feedbackId);
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
  const feedbackDoc = doc(db, "feedbacks", feedbackId);
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
