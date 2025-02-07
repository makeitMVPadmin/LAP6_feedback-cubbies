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

// Trigger: Whenever a new comment(feedback) is created, a new notification is created.
const onCommentCreated = functions.firestore
  .document("feedbacks/{feedbackId}")
  .onCreate(async (snapshot, context) => {
    try {
      const feedbackData = snapshot.data();
      const feedbackId = context.params.feedbackId;

      // Check if the fields exist
      if (!feedbackData || !feedbackData.userId || !feedbackData.portfolioId) {
        console.error("Missing required fields in feedback data");
        return null;
      }

      // Create a new notification
      await addDoc(collection(db, "notification"), {
        userId: feedbackData.userId,
        portfolioId: feedbackData.portfolioId,
        feedbackId: feedbackId,
        message: "New comment",
        readStatus: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return null;
    } catch (err) {
      console.error("Error creating notification: ", err);
      throw new Error(
        `createNotification while listening to comment creation failed: ${err.message}`
      );
    }
  });

// TODO: this block of code needs to be replaced with a real-time listener on the frontend.

  // Get all notifications for a user
  // const getNotifications = functions.https.onCall(async (context) => {
  //   // Check if the user is authenticated
  //   if (!context.auth) {
  //     throw new functions.https.HttpsError(
  //       "failed-precondition",
  //       "User is not authenticated."
  //     );
  //   }

  //   try {
  //     const querySnapshot = await getDocs(collection(db, "notification"));
  //     const notificationArray = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     console.log(notificationArray);
  //     return notificationArray;
  //   } catch (err) {
  //     console.error("Error getting notifications: ", err);
  //     throw new Error(`getNotifications failed: ${err.message}`);
  //   }
  // });

// Callable functions to fetch unread notifications and mark them as read.
// Get all unread notifications for a user
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
  onCommentCreated,
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
};
