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
import { use } from "react";
import React, { useEffect, useState } from "react";

const NotificationTabs = ({ ownerUserId }) => {
  const [getNotifications, setGetNotifications] = useState([]);
  const [getLastVisibleDoc, setGetLastVisibleDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [getUnreadComments, setGetUnreadComments] = useState([]);
  const [getUnreadReactions, setGetUnreadReactions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Listener for a new feedback created
  let isFeedbackListenerActive = false;
  const listenForNewFeedback = () => {
    if (isFeedbackListenerActive) {
      return;
    }
    isFeedbackListenerActive = true;
    try {
      const feedbackQuery = query(
        collection(db, "feedbacks"),
        where("createdAt", ">", new Date(Date.now() - 1000 * 60 * 60)),
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
  let isReactionListenerActive = false;
  const listenForNewReaction = () => {
    if (isReactionListenerActive) {
      return;
    }
    isReactionListenerActive = true;
    
    try {
      const reactionQuery = query(
        collection(db, "boosts"),
        where("createdAt", ">", new Date(Date.now() - 1000 * 60 * 60)),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(reactionQuery, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const boostId = change.doc.id;
            console.log("New reaction detected");

            try {
              await createReactionNotification(boostId);
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
    } finally {
      setLoading(false);
    }
  };

  // Listener for new notifications created
  const listenForNewNotifications = () => {
    try {
      const notificationQuery = query(
        collection(db, "notifications"),
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

  // console.log("getNotifications:", getNotifications);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      await fetchNotifications();
      if (isMounted) {
        const unsubscribeFeedback = listenForNewFeedback();
        const unsubscribeReaction = listenForNewReaction();
        const unsubscribeNotification = listenForNewNotifications();
        return () => {
          if (unsubscribeFeedback) unsubscribeFeedback();
          if (unsubscribeReaction) unsubscribeReaction();
          if (unsubscribeNotification) unsubscribeNotification();
        };
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [ownerUserId]);

  // Fetching unread notifications
  const fetchUnreadNotifs = async () => {
    setLoading(true);
    try {
      const cachedData = localStorage.getItem("unreadNotifs");
      if (cachedData) {
        setGetUnreadComments(JSON.parse(cachedData).comments);
        setGetUnreadReactions(JSON.parse(cachedData).reactions);
        setLoading(false);
        return;
      }

      const [unreadComments, unreadReactions] = await Promise.all([
        getUnreadCommentsNotification(ownerUserId),
        getUnreadReactionsNotification(ownerUserId),
      ]);

      setGetUnreadComments(unreadComments || []);
      setGetUnreadReactions(unreadReactions || []);

      localStorage.setItem(
        "unreadNotifs",
        JSON.stringify({ comments: unreadComments, reactions: unreadReactions })
      );
    } catch (err) {
      console.error("Error fetching notifications list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadNotifs();
  }, [ownerUserId]);

  // useEffect(() => {
  //   const fetchUnreadCount = async () => {
  //     const count = await getNotificationsCounter(ownerUserId);
  //     setUnreadCount(count);
  //   };

  //   fetchUnreadCount();

  //   const notificationQuery = query(
  //     collection(db, "notifications"),
  //     where("userId", "==", ownerUserId),
  //     where("readStatus", "==", false)
  //   );

  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  //   const unsubscribe = onSnapshot(notificationQuery, (snapshot) => {
  //     setUnreadCount(snapshot.docs.length); // Update unread count in real-time
  //   });

  //   return () => unsubscribe();
  // }, [ownerUserId]);

  return (
    <>
      <Tabs defaultValue="all">
        <TabsList className="bg-[#0264D4] w-full flex justify-start gap-[48px] rounded-none h-14 p-[12px_16px]">
          <TabsTrigger
            value="all"
            className="text-white text-[20px] border border-[#FFF9F4] hover:bg-gray-200 transition-colors duration-200 rounded-md data-[state=active]:text-[#4A4459] py-0 h-[32px] w-[58px]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="text-white text-[20px] border border-[#FFF9F4] hover:bg-gray-200 transition-colors duration-200 rounded-md data-[state=active]:text-[#4A4459] py-0 h-[32px] w-[165px]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Comments
          </TabsTrigger>
          <TabsTrigger
            value="reactions"
            className="text-white text-[20px] border border-[#FFF9F4] hover:bg-gray-200 transition-colors duration-200 rounded-md data-[state=active]:text-[#4A4459] py-0 h-[32px] w-[124px]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
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
                  className="flex items-start justify-between w-full border rounded-lg gap-[24px] bg-[#F5F5F5] p-[16px_24px]"
                  style={{
                    borderTop: "1px solid var(--Gray-Gray12, #28363F)",
                    borderRight: "2px solid var(--Gray-Gray12, #28363F)",
                    borderBottom: "2px solid var(--Gray-Gray12, #28363F)",
                    borderLeft: "1px solid var(--Gray-Gray12, #28363F)",
                    background: "var(--neutral-100, #F5F5F5)",
                  }}
                >
                  <span class="material-symbols-outlined">account_circle</span>
                  <div className="flex-grow">
                    <h3
                      className="font-bold text-[16px]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {notif.message}
                    </h3>
                    <p
                      className=" text-[14px] h-[24px]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {notif.feedbackContent}
                    </p>
                    <p
                      className="text-right text-[16px]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
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
              <p
                className="flex items-start justify-between w-full p-[16px_24px] border rounded-lg bg-[#F5F5F5]"
                style={{
                  borderTop: "1px solid var(--Gray-Gray12, #28363F)",
                  borderRight: "2px solid var(--Gray-Gray12, #28363F)",
                  borderBottom: "2px solid var(--Gray-Gray12, #28363F)",
                  borderLeft: "1px solid var(--Gray-Gray12, #28363F)",
                  background: "var(--neutral-100, #F5F5F5)",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
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
                  className="flex items-start justify-between w-full border rounded-lg gap-[24px] bg-[#F5F5F5] p-[16px_24px]"
                  style={{
                    borderTop: "1px solid var(--Gray-Gray12, #28363F)",
                    borderRight: "2px solid var(--Gray-Gray12, #28363F)",
                    borderBottom: "2px solid var(--Gray-Gray12, #28363F)",
                    borderLeft: "1px solid var(--Gray-Gray12, #28363F)",
                    background: "var(--neutral-100, #F5F5F5)",
                  }}
                >
                  <span class="material-symbols-outlined">account_circle</span>
                  <div className="flex-grow text-center">
                    <h3
                      className="font-bold text-[16px]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {unreadNotif.message}
                    </h3>
                    <p
                      className="text-right text-[14px]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
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
              <p
                className="flex items-start justify-between w-full p-[16px_24px] border rounded-lg bg-[#F5F5F5]"
                style={{
                  borderTop: "1px solid var(--Gray-Gray12, #28363F)",
                  borderRight: "2px solid var(--Gray-Gray12, #28363F)",
                  borderBottom: "2px solid var(--Gray-Gray12, #28363F)",
                  borderLeft: "1px solid var(--Gray-Gray12, #28363F)",
                  background: "var(--neutral-100, #F5F5F5)",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
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
                  className="flex items-start justify-between w-full border rounded-lg gap-[24px] bg-[#F5F5F5] p-[16px_24px]"
                  style={{
                    borderTop: "1px solid var(--Gray-Gray12, #28363F)",
                    borderRight: "2px solid var(--Gray-Gray12, #28363F)",
                    borderBottom: "2px solid var(--Gray-Gray12, #28363F)",
                    borderLeft: "1px solid var(--Gray-Gray12, #28363F)",
                    background: "var(--neutral-100, #F5F5F5)",
                  }}
                >
                  <span class="material-symbols-outlined">account_circle</span>
                  <div className="flex-grow text-center">
                    <h3
                      className="font-bold text-[16px]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {unreadNotif.message}
                    </h3>
                    <p
                      className="text-right text-[46px]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
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
              <p
                className="flex items-start justify-between w-full p-[16px_24px] border rounded-lg bg-[#F5F5F5]"
                style={{
                  borderTop: "1px solid var(--Gray-Gray12, #28363F)",
                  borderRight: "2px solid var(--Gray-Gray12, #28363F)",
                  borderBottom: "2px solid var(--Gray-Gray12, #28363F)",
                  borderLeft: "1px solid var(--Gray-Gray12, #28363F)",
                  background: "var(--neutral-100, #F5F5F5)",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
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
