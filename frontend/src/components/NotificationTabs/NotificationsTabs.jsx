import { db } from "../../firebase/firebase";
import {
  createCommentNotification,
  createReactionNotification,
  getAllNotifications,
  getUnreadCommentsNotification,
  getUnreadReactionsNotification,
} from "../../firebase/functions/notifications";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs.jsx";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

const NotificationTabs = ({ ownerUserId }) => {
  const [getNotifications, setGetNotifications] = useState([]);
  const [getLastVisibleDoc, setGetLastVisibleDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [getUnreadComments, setGetUnreadComments] = useState([]);
  const [getUnreadReactions, setGetUnreadReactions] = useState([]);

  // Listener for a new feedback created
  const listenForNewFeedback = () => {
    try {
      const feedbackQuery = query(
        collection(db, "feedback"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(feedbackQuery, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const feedbackId = change.doc.id;
            console.log("New feedback detected");

            try {
              await createCommentNotification(feedbackId);
            } catch (err) {
              console.error("Failed to create notification:", err);
            }
          }
        });
      });
      return unsubscribe;
    } catch (err) {
      console.error("Error listening for new feedback: ", err);
      return [];
    }
  };

  // Listener for a new reaction created
  const listenForNewReaction = () => {
    try {
      const reactionQuery = query(
        collection(db, "reaction"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(reactionQuery, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const reactionId = change.doc.id;
            console.log("New reaction detected");

            try {
              await createReactionNotification(reactionId);
            } catch (err) {
              console.error("Failed to create notification:", err);
            }
          }
        });
      });
      return unsubscribe;
    } catch (err) {
      console.error("Error listening for new reaction: ", err);
      return [];
    }
  };

  // Fetching all notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { notificationList, lastVisible } = await getAllNotifications(
        ownerUserId
      );
      setGetNotifications(
        Array.isArray(notificationList) ? notificationList : []
      );
      setGetLastVisibleDoc(lastVisible);
    } catch (err) {
      console.error("Error getting initial notifications list: ", err);
      // setGetNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  // Listener for new notifications created
  const listenForNewNotifications = () => {
    try {
      const notificationQuery = query(
        collection(db, "notification"),
        where("userId", "==", ownerUserId),
        orderBy("createdAt", "desc")
      );

      // onSnapshot to listen for new notifications
      const unsubscribe = onSnapshot(notificationQuery, (snapshot) => {
        const newNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update the notifications state and removing duplicates
        setGetNotifications((prev) => {
          const prevArr = Array.isArray(prev) ? prev : [];
          const mergedArr = [
            ...newNotifications.filter(
              (newNotification) =>
                !prevArr.some((p) => p.id === newNotification.id)
            ),
            ...prevArr,
          ];
          return mergedArr;
        });
      });

      return unsubscribe;
    } catch (err) {
      console.error("Error listening for new notifications: ", err);
      return [];
    }
  };

  console.log("getNotifications:", getNotifications);

  useEffect(() => {
    fetchNotifications();
    const unsubscribeFeedback = listenForNewFeedback();
    const unsubscribeReaction = listenForNewReaction();
    const unsubscribeNotification = listenForNewNotifications();
    return () => {
      if (unsubscribeFeedback) unsubscribeFeedback();
      if (unsubscribeReaction) unsubscribeReaction();
      if (unsubscribeNotification) unsubscribeNotification();
    };
  }, [ownerUserId]);

  // Fetching unread notifications
  const fetchUnreadNotifs = async () => {
    setLoading(true);
    try {
      const [unreadComments, unreadReactions] = await Promise.all([
        getUnreadCommentsNotification(ownerUserId),
        getUnreadReactionsNotification(ownerUserId),
      ]);

      setGetUnreadComments(unreadComments || []);
      setGetUnreadReactions(unreadReactions || []);
    } catch (err) {
      console.error("Error fetching notifications list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadNotifs();
  }, [ownerUserId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (getNotifications.length == 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">ALL</TabsTrigger>
          <TabsTrigger value="comments">COMMENTS</TabsTrigger>
          <TabsTrigger value="reactions">REACTIONS</TabsTrigger>
        </TabsList>

        {/* ALL Notifications */}
        <TabsContent value="all">
          <section>
            {/* map through the notifications */}
            {getNotifications.map((notif) => (
              <div key={notif.id}>
                <h3>{notif.message}</h3>
                {/* <p>{notif.feedbackId}</p> TODO: get the actual feedback */}
                <p>{new Date(notif.createdAt.toDate()).toLocaleDateString()}</p>
                <p>
                  {" "}
                  {new Date(notif.createdAt.toDate()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </section>
        </TabsContent>

        {/* Unread Comments */}
        <TabsContent value="comments">
          {getUnreadComments.length > 0 ? (
            getUnreadComments.map((unreadNotif) => (
              <div>
                <h3>{unreadNotif.message}</h3>
                <p>{new Date(unreadNotif.createdAt.toDate()).toLocaleDateString()}</p>
                <p>
                  {" "}
                  {new Date(unreadNotif.createdAt.toDate()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))
          ) : (
            <p>No notifications to display.</p>
          )}
        </TabsContent>

        {/* Unread Reactions */}
        <TabsContent value="reactions">
          {getUnreadReactions.length > 0 ? (
            getUnreadReactions.map((unreadNotif) => (
              <div>
                <h3>{unreadNotif.message}</h3>
                <p>{new Date(unreadNotif.createdAt.toDate()).toLocaleDateString()}</p>
                <p>
                  {" "}
                  {new Date(unreadNotif.createdAt.toDate()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))
          ) : (
            <p>No notifications to display.</p>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default NotificationTabs;
