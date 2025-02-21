import { db } from "../../firebase/firebase";
import { deleteNotification } from "../../firebase/functions/kebabFunction";
import {
  createCommentNotification,
  createReactionNotification,
  getAllNotifications,
  getUnreadCommentsNotification,
  getUnreadReactionsNotification,
} from "../../firebase/functions/notifications";
import KebabMenu from "../KebabMenu/KebabMenu";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // if (getNotifications.length == 0) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <Tabs defaultValue="all">
        <TabsList className="bg-[#0954B0] p-2 w-full flex justify-evenly rounded-none h-14">
          <TabsTrigger
            value="all"
            className="text-black border border-[#FFF9F4] hover:bg-gray-200 transition-colors duration-200 rounded-md data-[state=active]:text-blue-500"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="text-black border border-[#FFF9F4] hover:bg-gray-200 transition-colors duration-200 rounded-md data-[state=active]:text-blue-500"
          >
            Comments
          </TabsTrigger>
          <TabsTrigger
            value="reactions"
            className="text-black border border-[#FFF9F4] hover:bg-gray-200 transition-colors duration-200 rounded-md data-[state=active]:text-blue-500"
          >
            Reactions
          </TabsTrigger>
        </TabsList>

        {/* ALL Notifications */}
        <TabsContent value="all">
          <section className="flex flex-col gap-2">
            {/* map through the notifications */}
            {getNotifications.length > 0 ? (
              getNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start justify-between w-full p-4 border rounded-lg shadow-sm gap-2"
                >
                  <span class="material-symbols-outlined">account_circle</span>
                  <div className="flex-grow">
                    <h3 className="font-bold">{notif.message}</h3>
                    <p>{notif.feedbackContent}</p>
                    <p className="text-right">
                      {notif.createdAt
                        ? new Date(
                            notif.createdAt.toDate()
                          ).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                  <KebabMenu
                    onBlock={() => console.log("Block user:", notif.userId)}
                    onMute={() => console.log("Mute user:", notif.userId)}
                    onDelete={() => deleteNotification(notif.id)}
                    onPreferences={() =>
                      console.log("Open notification preferences")
                    }
                  />
                </div>
              ))
            ) : (
              <p className="flex items-start justify-between w-full p-4 border rounded-lg shadow-sm">
                No notifications to display.
              </p>
            )}
          </section>
        </TabsContent>

        {/* Unread Comments */}
        <TabsContent value="comments">
          <section className="flex flex-col gap-2">
            {getUnreadComments.length > 0 ? (
              getUnreadComments.map((unreadNotif) => (
                <div
                  key={unreadNotif.id}
                  className="flex items-start justify-between w-full p-4 border rounded-lg shadow-sm"
                >
                  <span class="material-symbols-outlined">account_circle</span>
                  <div className="flex-grow text-center">
                    <h3 className="font-bold">{unreadNotif.message}</h3>
                    <p className="text-right">
                      {notif.createdAt
                        ? new Date(
                            notif.createdAt.toDate()
                          ).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                  <KebabMenu
                    onBlock={() =>
                      console.log("Block user:", unreadNotif.userId)
                    }
                    onMute={() => console.log("Mute user:", unreadNotif.userId)}
                    onDelete={() => deleteNotification(unreadNotif.id)}
                    onPreferences={() =>
                      console.log("Open notification preferences")
                    }
                  />
                </div>
              ))
            ) : (
              <p className="flex items-start justify-between w-full p-4 border rounded-lg shadow-sm">
                No notifications to display.
              </p>
            )}
          </section>
        </TabsContent>

        {/* Unread Reactions */}
        <TabsContent value="reactions">
          <section className="flex flex-col gap-2">
            {getUnreadReactions.length > 0 ? (
              getUnreadReactions.map((unreadNotif) => (
                <div
                  key={unreadNotif.id}
                  className="flex items-start justify-between w-full p-4 border rounded-lg shadow-sm"
                >
                  <span class="material-symbols-outlined">account_circle</span>
                  <div className="flex-grow text-center">
                    <h3 className="font-bold">{unreadNotif.message}</h3>
                    <p className="text-right">
                      {notif.createdAt
                        ? new Date(
                            notif.createdAt.toDate()
                          ).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                  <KebabMenu
                    onBlock={() =>
                      console.log("Block user:", unreadNotif.userId)
                    }
                    onMute={() => console.log("Mute user:", unreadNotif.userId)}
                    onDelete={() => deleteNotification(unreadNotif.id)}
                    onPreferences={() =>
                      console.log("Open notification preferences")
                    }
                  />
                </div>
              ))
            ) : (
              <p className="flex items-start justify-between w-full p-4 border rounded-lg shadow-sm">
                No notifications to display.
              </p>
            )}
          </section>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default NotificationTabs;
