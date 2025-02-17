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

// CREATE
export const createCommentNotification = async (feedbackId) => {
  try {
    // Fetch the feedback
    const feedbackDoc = await getDoc(doc(db, "feedback", feedbackId));
    if (!feedbackDoc.exists()) {
      console.error("Feedback not found");
      return null;
    }

    const feedbackData = feedbackDoc.data();
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
    const senderDoc = await getDoc(doc(db, "users", feedbackData.userId));
    console.log("feedbackData.userId:", feedbackData.userId);
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
      message: `@${senderName} commented on your portfolio`,
      readStatus: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error creating notification: ", err);
    throw new Error(
      `createNotification while listening to comment creation failed: ${err.message}`
    );
  }
};

export const createReactionNotification = async (reactionId) => {
  try {
    // Fetch the reaction
    const reactionDoc = await getDoc(doc(db, "reaction", reactionId));
    if (!reactionDoc.exists()) {
      console.error("Reaction not found");
      return null;
    }

    const reactionData = reactionDoc.data();
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
    const senderDoc = await getDoc(doc(db, "users", reactionData.userId));
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
  } catch (err) {
    console.error("Error creating reaction notification:", err);
    throw new Error(
      `createNotification while listening to reaction creation failed: ${err.message}`
    );
  }
};

// GET
// Get paginated notifications for a user "All" Notifications Tab
export const getAllNotifications = async (
  ownerUserId,
  lastVisibleDoc = null
) => {
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
    const notificationList = [];

    for (const docSnap of notificationSnapshot.docs) {
      let notificationData = {
        id: docSnap.id,
        ...docSnap.data(),
      };

      if (notificationData.feedbackId) {
        const feedbackDoc = await getDoc(
          doc(db, "feedback", notificationData.feedbackId)
        );
        if (feedbackDoc.exists()) {
          notificationData.feedbackContent = feedbackDoc.data().comment;
        } else {
          notificationData.feedbackContent = null;
        }
      }
      notificationList.push(notificationData);
    }

    const lastVisible =
      notificationSnapshot.docs[notificationSnapshot.docs.length - 1];
    return { notificationList, lastVisible };
  } catch (err) {
    console.error("Error getting notifications: ", err);
    throw new Error(`getNotifications failed: ${err.message}`);
  }
};

// Get all unread notifications for a user "Unread Comments/Feedbacks & Reactions Tab"
export const getUnreadCommentsNotification = async (ownerUserId) => {
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

    console.log(unreadFeedbackQuery);

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
export const getUnreadReactionsNotification = async (ownerUserId) => {
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
export const markNotificationAsRead = async (notificationId) => {
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
