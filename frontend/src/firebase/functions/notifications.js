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
  onSnapshot,
} from "firebase/firestore";

// CREATE
// Trigger: Whenever a new comment(feedback) is created, a new notification is created.
const onCommentCreated = functions.firestore
  .document("feedback/{feedbackId}")
  .onCreate(async (snapshot, context) => {
    try {
      const feedbackData = snapshot.data();
      const feedbackId = context.params.feedbackId;

      // Check if the data exist
      if (!feedbackData || !feedbackData.userId || !feedbackData.portfolioId) {
        console.error("Missing required fields in feedback data");
        return null;
      }

      // Fetch the portfolio
      const portfolioDoc = await getDoc(
        doc(db, "portfolio", feedbackData.portfolioId)
      );
      if (!portfolioDoc.exists()) {
        console.error("Portfolio not found");
        return null;
      }

      // Fetch the sender
      const senderDoc = await getDoc(doc(db, "user", feedbackData.userId));
      if (!senderDoc.exists()) {
        console.error("User not found");
        return null;
      }
      const senderName = senderDoc.data().username;

      // Create a new notification
      await addDoc(collection(db, "notification"), {
        userId: feedbackData.userId, // Sender
        portfolioId: feedbackData.portfolioId, // Receiver
        feedbackId: feedbackId,
        message: `${senderName} commented on your portfolio`,
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

// Trigger: Whenever a user reacts to a portfolio, a new reaction is created.
const onReactionCreated = functions.firestore
  .document("reaction/{reactionId}")
  .onCreate(async (snapshot, context) => {
    try {
      const reactionData = snapshot.data();
      const reactionId = context.params.reactionId;

      // Check if the data exist
      if (!reactionData || !reactionData.userId || !reactionData.portfolioId) {
        console.error("Missing required fields in reaction data");
        return null;
      }

      // Fetch the portfolio
      const portfolioDoc = await getDoc(
        doc(db, "portfolio", reactionData.portfolioId)
      );
      if (!portfolioDoc.exists()) {
        console.error("Portfolio not found");
        return null;
      }

      // Fetch the sender
      const senderDoc = await getDoc(doc(db, "user", reactionData.userId));
      if (!senderDoc.exists()) {
        console.error("User not found");
        return null;
      }
      const senderName = senderDoc.data().username;

      // Create a new notification for the reaction
      await addDoc(collection(db, "notification"), {
        userId: reactionData.userId,
        portfolioId: reactionData.portfolioId,
        reactionId,
        message: `${senderName} reacted to your portfolio`,
        readStatus: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return null;
    } catch (err) {
      console.error("Error creating reaction notification:", err);
      throw new Error(`onReactionCreated failed: ${err.message}`);
    }
  });

// GET
// Get paginated notifications for a user "All" Notifications Tab
const getAllNotifications = async (ownerUserId, lastVisibleDoc = null) => {
  try {
    // Fetch all the portofolios associated with the ownerUserId
    const portfolioQuery = query(
      collection(db, "portfolio"),
      where("userId", "==", ownerUserId)
    );
    const portfolioSnapshot = await getDocs(portfolioQuery);
    const portfolioIds = portfolioSnapshot.docs.map((doc) => doc.id);
    if (portfolioIds.length === 0) {
      return {
        notifications: [],
        lastVisibleDoc: null,
      };
    }

    // Fetch all notifications(paginated) for the ownerUserId's portfolios
    let notificationQuery = query(
      collection(db, "notification"),
      where("portfolioId", "in", portfolioIds),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    if (lastVisibleDoc) {
      notificationQuery = query(notificationQuery, startAfter(lastVisibleDoc));
    }
    const notificationSnapshot = await getDocs(notificationQuery);
    const notificationList = notificationSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const lastVisible = notificationSnapshot.docs[
      notificationSnapshot.docs.length - 1
    ];
    return { notificationList, lastVisible };
  } catch (err) {
    console.error("Error getting notifications: ", err);
    throw new Error(`getNotifications failed: ${err.message}`);
  }
};

// Get all unread notifications for a user "Unread Comments/Feedbacks & Reactions Tab"
const getUnreadCommentsNotification = async (ownerUserId) => {
  try {
    // Filtering for unread notifications
    const notificationsRef = collection(db, "notification");
    const unreadFeedbackQuery = query(
      notificationsRef,
      where("userId", "==", ownerUserId),
      where("reactionId", "==", null),
      where("readStatus", "==", false),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const querySnapshot = await getDocs(unreadFeedbackQuery);

    // Extracting the unread data
    const unreadComments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return unreadComments;
  } catch (err) {
    console.error("Error getting notifications: ", err);
    throw new Error(`getUnreadCommentsNotifications failed: ${err.message}`);
  }
};

// Get all unread notifications for a user "Unread Comments/Feedbacks & Reactions Tab"
const getUnreadReactionsNotification = async (ownerUserId) => {
  try {
    // Filtering for unread notifications of the entire collection
    const notificationsRef = collection(db, "notification");
    const unreadReactionQuery = query(
      notificationsRef,
      where("userId", "==", ownerUserId),
      where("reactionId", "!=", null),
      where("readStatus", "==", false),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const querySnapshot = await getDocs(unreadReactionQuery);

    // Extracting the unread data
    const unreadReaction = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),  
    }));
    return unreadReaction;
  } catch (err) {
    console.error("Error getting notifications: ", err);
    throw new Error(`getUnreadCommentsNotifications failed: ${err.message}`);
  }
};

// Mark a notification as read
const markNotificationAsRead = async (notificationId) => {
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
  };

export default {
  onCommentCreated,
  onReactionCreated,
  getAllNotifications,
  getUnreadCommentsNotification,
  getUnreadReactionsNotification,
  markNotificationAsRead,
};
