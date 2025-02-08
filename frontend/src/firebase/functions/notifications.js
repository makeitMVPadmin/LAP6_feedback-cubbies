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
  getDoc,
} from "firebase/firestore";

// Data Structure: 'notification' collection
//id - notification id
//userId - assumption: this is the sender
//portfolioId - Id of the portfolio receiving the feedback
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

      // Fetch the portfolio to get the ownerUserId (receiver)
      const portfolioDoc = await getDoc(
        doc(db, "portfolio", feedbackData.portfolioId)
      );
      if (!portfolioDoc.exists()) {
        console.error("Portfolio not found");
        return null;
      }

      const ownerUserId = portfolioDoc.data().userId;

      // Create a new notification
      await addDoc(collection(db, "notification"), {
        userId: feedbackData.userId, // Assuming this is the sender
        portfolioId: feedbackData.portfolioId,
        ownerUserId, // Assuming this is the receiver
        feedbackId: feedbackId,
        message: feedbackData.message,
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

// Callable functions to fetch unread notifications and mark them as read.

// Get paginated notificationns for a user "All Notifications Tab" (infinite scrolling)
const getNotifications = functions.https.onCall(
  async ({ userId, lastVisibleDoc }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "User is not authenticated."
      );
    }

    try {
      const notificationsRef = collection(db, "notification");
      // Fetching the first 5 notifications
      let q = query(
        notificationsRef,
        where("ownerUserId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(5) 
      );

      // Using last document snapshot('startAfter')
      if (lastVisibleDoc) {
        const lastVisibleSnapshot = await getDoc(
          doc(db, "notification", lastVisibleDoc)
        );
        q = query(
          notificationsRef,
          where("ownerUserId", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(lastVisibleSnapshot),
          limit(5)
        );
      }

      const querySnapshot = await getDocs(q);
      const notificationList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch the last document snapshot for the next call
      const lastVisibleDoc =
        querySnapshot.docs.length > 0
          ? querySnapshot.docs[querySnapshot.docs.length - 1].id
          : null;

      return { notificationList, lastVisibleDoc };
    } catch (err) {
      console.error("Error getting notifications: ", err);
      throw new Error(`getNotifications failed: ${err.message}`);
    }
  }
);

// Get all unread notifications for a user "Unread Notifications Tab"
const getUnreadNotifications = functions.https.onCall(
  async ({ userId }, context) => {
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
      const q = query(
        notificationsRef,
        where("ownerUserId", "==", userId),
        where("readStatus", "==", false),
        orderBy("createdAt", "desc"),
        limit(10) // TODO: adjust as per design requirements
      );

      const querySnapshot = await getDocs(q);

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
  async ({ notificationId }, context ) => {
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
