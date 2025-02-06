import { db } from "../firebase.js";
import * as functions from "firebase-functions";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

// Data Structure:
//id - notification id
//userId - sender
//portfolioId - receiver
//feedbackId - feedback id: commentId
//message - message
//readStatus
//createdAt
//updatedAt

//Create a new notification
const createNotification = functions.https.onCall(async (params, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "User is not authenticated."
    );
  }

  try {
    const docRef = await addDoc(collection(db, "notification"), {
      userId: params.userId,
      portfolioId: params.portfolioId,
      feedbackId: params.feedbackId,
      message: params.message,
      readStatus: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef;
  } catch (err) {
    console.error("Error creating notification: ", err);
    throw new Error(`createNotification failed: ${err.message}`);
  }
});

//Get all notifications for a user
const getNotifications = functions.https.onCall(async (context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "User is not authenticated."
    );
  }

  try {
    const querySnapshot = await getDocs(collection(db, "notification"));
    const notificationArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(notificationArray);
    return notificationArray;
  } catch (err) {
    console.error("Error getting notifications: ", err);
    throw new Error(`getNotifications failed: ${err.message}`);
  }
});

//Get all unread notifications for a user
const getUnreadNotifications = functions.https.onCall(
  async ({ userId, context }) => {
    // Check if the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "User is not authenticated."
      );
    }

    try {
      // Filtering for unread notifications of the entire collection
      const notificationsRef = collection(db, "notification");
      const notifQuery = query(
        notificationsRef,
        where("userId", "==", userId),
        where("readStatus", "==", false)
      );

      const querySnapshot = await getDocs(notifQuery);

      // Extracting the unread notification data
      const unreadNotifArray = [];
      querySnapshot.forEach((doc) => {
        unreadNotifArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(unreadNotifArray);
      return unreadNotifArray;
    } catch (err) {
      console.error("Error getting notifications: ", err);
      throw new Error(`getUnreadNotifications failed: ${err.message}`);
    }
  }
);

// Mark a notification as read
const markNotificationAsRead = functions.https.onCall(
  async ({ notificationId, context }) => {
    // Check if the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "User is not authenticated."
      );
    }

    try {
      // Reference to a single/specific document
      const notificationsDocRef = doc(db, "notification", notificationId);
      await updateDoc(notificationsDocRef, {
        readStatus: true,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.error("Error marking notification as read: ", err);
      throw new Error(`markNotificationAsRead failed: ${err.message}`);
    }
  }
);

export default {
  createNotification,
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
};
