import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

export const listenForNewFeedbacksAndBoosts = (ownerUserId) => {
  if (!ownerUserId) return;

  console.log("Listening for new feedbacks & boosts...");

  // Listen for new feedbacks
  const feedbackQuery = query(
    collection(db, "feedbacks"),
    where("userId", "==", ownerUserId),
    orderBy("createdAt", "desc")
  );

  const unsubscribeFeedbacks = onSnapshot(feedbackQuery, async (snapshot) => {
    for (const change of snapshot.docChanges()) {
      if (change.type === "added") {
        const feedbackData = change.doc.data();

        // Fetch the sender (commenter)
        const senderDoc = await getDoc(doc(db, "users", feedbackData.userId));
        if (!senderDoc.exists()) {
          console.error("Feedback sender not found");
          return;
        }
        const senderName = senderDoc.data().username;

        // Check if a notification already exists for this feedback
        const existingNotifications = await getDocs(
          query(
            collection(db, "notifications"),
            where("feedbackId", "==", change.doc.id)
          )
        );

        if (existingNotifications.empty) {
          await addDoc(collection(db, "notifications"), {
            userId: ownerUserId,
            feedbackId: change.doc.id,
            message: `@${senderName} commented on your portfolio`,
            readStatus: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log("New feedback notification created");
        }
      }
    }
  });

  // Listen for new boosts
  const boostQuery = query(
    collection(db, "boosts"),
    where("userId", "==", ownerUserId),
    orderBy("createdAt", "desc")
  );

  const unsubscribeBoosts = onSnapshot(boostQuery, async (snapshot) => {
    for (const change of snapshot.docChanges()) {
      if (change.type === "added") {
        const boostData = change.doc.data();

        // Fetch the sender (who boosted the portfolio)
        const senderDoc = await getDoc(doc(db, "users", boostData.userId));
        if (!senderDoc.exists()) {
          console.error("Boost sender not found");
          return;
        }
        const senderName = senderDoc.data().username;

        // Check if a notification already exists for this boost
        const existingNotifications = await getDocs(
          query(
            collection(db, "notifications"),
            where("boostId", "==", change.doc.id)
          )
        );

        if (existingNotifications.empty) {
          await addDoc(collection(db, "notifications"), {
            userId: ownerUserId,
            boostId: change.doc.id,
            message: `@${senderName} boosted your portfolio`,
            readStatus: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log("New boost notification created");
        }
      }
    }
  });

  return () => {
    unsubscribeFeedbacks();
    unsubscribeBoosts();
  };
};

// Listens only for unread notifications (to avoid unnecessary reads)
export const listenForUnreadNotifications = (ownerUserId, setNotifications) => {
  if (!ownerUserId) return;

  console.log("Listening for unread notifications...");

  const notificationsQuery = query(
    collection(db, "notifications"),
    where("userId", "==", ownerUserId),
    where("readStatus", "==", false),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(notificationsQuery, async (snapshot) => {
    let newNotifications = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    // Collect all unique feedbackIds
    const feedbackIds = [
      ...new Set(
        newNotifications
          .map((notification) => notification.feedbackId)
          .filter((id) => id) 
      ),
    ];

    // Fetch feedbacks in a batch (Firestore supports max 30 IDs in "in" query at a time)
    const feedbackMap = {};
    const batchSize = 30;
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

    newNotifications = newNotifications.map((notification) => ({
      ...notification,
      feedbackContent: feedbackMap[notification.feedbackId] || null,
    }));

    console.log(`Unread notifications: ${newNotifications.length}`);
    setNotifications(newNotifications);
  });

  return unsubscribe;
};
