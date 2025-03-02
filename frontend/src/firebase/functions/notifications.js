import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore";

// Get notifications for a user "All" Notifications Tab
export const getAllNotifications = async (ownerUserId) => {
  try {
    // 1. Fetch all portfolio IDs for the ownerUserId
    const portfolioQuery = query(
      collection(db, "portfolios"),
      where("userId", "==", ownerUserId)
    );

    const portfolioSnapshot = await getDocs(portfolioQuery);
    const portfolioIds = portfolioSnapshot.docs.map((doc) => doc.id);

    if (portfolioIds.length === 0) {
      console.log("No portfolios found for user.");
      return []; // No portfolios = no notifications
    }
    const feb28 = new Date("2025-02-28T23:59:59.999Z");
    // 2. Fetch notifications related to these portfolios
    const notificationQuery = query(
      collection(db, "notifications"),
      where("createdAt", ">", feb28),
      where("portfolioId", "in", portfolioIds),
      orderBy("createdAt", "desc"),
      limit(40)
    );

    const notificationSnapshot = await getDocs(notificationQuery);
    console.log("notificationSnapshot: ", notificationSnapshot);
    let notificationList = notificationSnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    // 3. Collect all unique feedbackIds
    const feedbackIds = [
      ...new Set(
        notificationList
          .map((notification) => notification.feedbackId)
          .filter((id) => id)
      ),
    ];
    console.log("feedbackIds: ", feedbackIds);

    // 4. Fetch feedback comments in batch
    const feedbackMap = {};
    const batchSize = 30; // Firestore "in" queries can handle up to 30 items
    for (let i = 0; i < feedbackIds.length; i += batchSize) {
      const batchIds = feedbackIds.slice(i, i + batchSize);
      const feedbackQuery = query(
        collection(db, "feedbacks"),
        where("__name__", "in", batchIds)
      );

      const feedbackSnapshot = await getDocs(feedbackQuery);
      feedbackSnapshot.forEach((feedbackDoc) => {
        feedbackMap[feedbackDoc.id] = feedbackDoc.data().comment;
      });
    }

    // 5. Add feedback content to each notification
    notificationList = notificationList.map((notification) => ({
      ...notification,
      feedbackContent: feedbackMap[notification.feedbackId] || null,
    }));
    console.log("Final notification list in backend: ", notificationList);
    return notificationList;
  } catch (err) {
    console.error("Error getting notifications: ", err);
    throw new Error(`getNotifications failed: ${err.message}`);
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    // Reference to a single/specific document
    const notificationsDocRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationsDocRef, {
      readStatus: true,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("Error marking notification as read: ", err);
    throw new Error(`markNotificationAsRead failed: ${err.message}`);
  }
};
