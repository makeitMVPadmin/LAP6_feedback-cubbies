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
  runTransaction
} from "firebase/firestore";

// CREATE
export const createCommentNotification = async (feedbackId) => {
  try {
    // Fetch the feedback
    const feedbackDoc = await getDoc(doc(db, "feedbacks", feedbackId));
    if (!feedbackDoc.exists()) {
      console.error("Feedback not found");
      return null;
    }

    const feedbackData = feedbackDoc.data();
    if (!feedbackData || !feedbackData.userId || !feedbackData.portfolioId) {
      console.error("Missing required fields in feedback data");
      return null;
    }

    // Check if the notification already exists
    const existingNotifQuery = query(
      collection(db, "notifications"),
      where("feedbackId", "==", feedbackId)
    );

    const existingNotifSnapshot = await getDocs(existingNotifQuery);

    if (!existingNotifSnapshot.empty) {
      console.log("Notification already exists, skipping write.");
      return;
    }

    // Fetch the portfolio
    const portfolioDoc = await getDoc(
      doc(db, "portfolios", feedbackData.portfolioId)
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
    await addDoc(collection(db, "notifications"), {
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

// export const createCommentNotification = async (feedbackId) => {
//   try {
//     await runTransaction(db, async (transaction) => {
//       // Fetch the feedback document
//       const feedbackRef = doc(db, "feedbacks", feedbackId);
//       const feedbackDoc = await transaction.get(feedbackRef);

//       if (!feedbackDoc.exists()) {
//         console.error("Feedback not found");
//         return;
//       }

//       const feedbackData = feedbackDoc.data();
//       if (!feedbackData || !feedbackData.userId || !feedbackData.portfolioId) {
//         console.error("Missing required fields in feedback data");
//         return;
//       }

//       // Query for existing notification
//       const existingNotifQuery = query(
//         collection(db, "notifications"),
//         where("feedbackId", "==", feedbackId)
//       );
//       const existingNotifSnapshot = await getDocs(existingNotifQuery);

//       if (!existingNotifSnapshot.empty) {
//         console.log("Notification already exists, skipping write.");
//         return;
//       }

//       // Fetch the portfolio
//       const portfolioRef = doc(db, "portfolios", feedbackData.portfolioId);
//       const portfolioDoc = await transaction.get(portfolioRef);
//       if (!portfolioDoc.exists()) {
//         console.error("Portfolio not found");
//         return;
//       }

//       // Fetch the sender
//       const senderRef = doc(db, "users", feedbackData.userId);
//       const senderDoc = await transaction.get(senderRef);
//       if (!senderDoc.exists()) {
//         console.error("User not found");
//         return;
//       }
//       const senderName = senderDoc.data().username;

//       // Add the new notification inside the transaction
//       const notificationRef = collection(db, "notifications");
//       transaction.set(doc(notificationRef), {
//         userId: feedbackData.userId,
//         portfolioId: feedbackData.portfolioId,
//         feedbackId: feedbackId,
//         message: `@${senderName} commented on your portfolio`,
//         readStatus: false,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });

//       console.log("Notification successfully created within transaction.");
//     });
//   } catch (err) {
//     console.error("Error creating notification:", err);
//     throw new Error(
//       `createNotification while listening to comment creation failed: ${err.message}`
//     );
//   }
// };

export const createBoostNotification = async (boostId) => {
  try {
    // Fetch the boost
    const boostDoc = await getDoc(doc(db, "boosts", boostId));
    if (!boostDoc.exists()) {
      console.error("Boost not found");
      return null;
    }

    const boostData = boostDoc.data();
    if (!boostData || !boostData.userId || !boostData.portfolioId) {
      console.error("Missing required fields in boost data");
      return null;
    }

    // Check if the notification already exists
    const existingNotifQuery = query(
      collection(db, "notifications"),
      where("boostId", "==", boostId)
    );
    const existingNotifSnapshot = await getDocs(existingNotifQuery);
    if (!existingNotifSnapshot.empty) {
      console.log("Notification already exists, skipping write.");
      return;
    }

    // Fetch the portfolio
    const portfolioDoc = await getDoc(
      doc(db, "portfolios", reactionData.portfolioId)
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
    await addDoc(collection(db, "notifications"), {
      userId: reactionData.userId,
      portfolioId: reactionData.portfolioId,
      boostId: boostId,
      message: `${senderName} boosted your portfolio`,
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
// Get notifications for a user "All" Notifications Tab
export const getAllNotifications = async (
  ownerUserId
) => {
  try {
    // Fetch all the portfolios associated with the ownerUserId
    const portfolioQuery = query(
      collection(db, "portfolios"),
      where("userId", "==", ownerUserId)
    );
    const portfolioSnapshot = await getDocs(portfolioQuery);
    const portfolioIds = portfolioSnapshot.docs.map((doc) => doc.id);
    if (portfolioIds.length === 0) {
      return [];
    }

    // Fetch all notifications(paginated) for the ownerUserId's portfolios
    let notificationQuery = query(
      collection(db, "notifications"),
      where("portfolioId", "in", portfolioIds),
      // orderBy("createdAt", "desc"),
      // limit(5)
    );

    const notificationSnapshot = await getDocs(notificationQuery);
    const notificationList = [];

    for (const docSnap of notificationSnapshot.docs) {
      let notificationData = {
        id: docSnap.id,
        ...docSnap.data(),
      };

      console.log("raw notificationData: ", notificationData);
      
      if (notificationData.feedbackId) {
        const feedbackDoc = await getDoc(
          doc(db, "feedbacks", notificationData.feedbackId)
        );

        if (feedbackDoc.exists()) {
          notificationData.feedbackContent = feedbackDoc.data().comment;
          console.log("Fetched feedbackContent: ", notificationData.feedbackContent);
        } else {
          notificationData.feedbackContent = null;
        }
      }
      notificationList.push(notificationData);
    }

    console.log("notificationList: ", notificationList);
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

// Notifications Counter
export const getNotificationsCounter = async (ownerUserId) => {
  try {
    const notificationsRef = collection(db, "notifications");

    // Query for the total number of notifications
    const totalQuery = query(
      notificationsRef,
      where("userId", "==", ownerUserId)
    );

    const totalSnapshot = await getDocs(totalQuery);
    const totalCount = totalSnapshot.docs.length;

    // Query comments count
    const commentQuery = query(
      notificationsRef,
      where("userId", "==", ownerUserId),
      where("feedbackId", "!=", null)
    );
    const commentSnapshot = await getDocs(commentQuery);
    const commentCount = commentSnapshot.docs.length;

    // Query boosts count
    const boostQuery = query(
      notificationsRef,
      where("userId", "==", ownerUserId),
      where("boostId", "!=", null)
    );
    const boostSnapshot = await getDocs(boostQuery);
    const boostCount = boostSnapshot.docs.length;

    return {
      totalCount,
      commentCount: commentCount ?? 0,
      boostCount: boostCount ?? 0,
    };
  } catch (err) {
    console.error("Error getting total notifications count: ", err);
    return 0;
  }
}