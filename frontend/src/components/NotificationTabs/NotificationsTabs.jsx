import { useNavigation } from "../../context/NavigationContext";
import { db } from "../../firebase/firebase";
import { deleteNotification } from "../../firebase/functions/kebabFunction";
import {
  createCommentNotification,
  createBoostNotification,
  getAllNotifications,
  getNotificationsCounter,
  markNotificationAsRead,
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
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [boostCount, setBoostCount] = useState(0);
  const [notifClick, setNotifClick] = useState(getNotifications);
  const { goToProfileDetails } = useNavigation();
  const [commentNotif, setCommentNotif] = useState([]);
  const [boostNotif, setBoostNotif] = useState([]);

  // Listener for a new comment created
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

  // Listener for a new boost created
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
              await createBoostNotification(boostId);
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
      const { notificationList } = await getAllNotifications(ownerUserId);

      setGetNotifications(
        Array.isArray(notificationList) ? notificationList : []
      );
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
        where("readStatus", "==", false),
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
          // console.log("New notifications: ", newNotifications);
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

  // Filtering notifications by comments and boosts
  const commentNotifications = getNotifications.filter(
    (notif) => notif.feedbackId
  );
  const boostNotifications = getNotifications.filter((notif) => notif.boostId);


  // Fetch notifications count
  const fetchNotificationsCounts = async () => {
    try {
      const { totalCount, commentCount, boostCount } =
        await getNotificationsCounter(ownerUserId);

      // Ensure default values if undefined
      const safeCommentCount = commentCount ?? 0;
      const safeBoostCount = boostCount ?? 0;

      // Only update state if values actually changed
      setTotalCount((prev) => (prev !== totalCount ? totalCount : prev));
      setCommentCount((prev) =>
        prev !== safeCommentCount ? safeCommentCount : prev
      );
      setBoostCount((prev) =>
        prev !== safeBoostCount ? safeBoostCount : prev
      );
    } catch (err) {
      console.error("Error fetching notification counts: ", err);
    }
  };

  // Handle Notification Click
  const handleNotificationClick = async (notif) => {
    if (!notif.portfolioId) {
      console.error("No portfolioId found in notification");
      return;
    }

    setNotifClick((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, readStatus: true } : n))
    );

    try {
      await markNotificationAsRead(notif.id);
    } catch (err) {
      console.error("Failed to mark notification as read: ", err);
    }

    //Redirect to portfolio page
    goToProfileDetails(notif.portfolioId);
  };

  useEffect(() => {
    setCommentNotif(getNotifications.filter((notif) => notif.feedbackId));
    setBoostNotif(getNotifications.filter((notif) => notif.boostId));
  }, [getNotifications]);

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

  useEffect(() => {
    if (!ownerUserId) return;
    fetchNotificationsCounts();
  }, [ownerUserId]);

  return (
    <>
      <Tabs defaultValue="all">
        <TabsList className="bg-[#0264D4] w-full flex justify-start gap-[48px] rounded-none h-14 p-[12px_16px] relative">
          <TabsTrigger
            value="all"
            className="text-white text-[20px] border border-[#FFF9F4] hover:bg-gray-200 transition-colors duration-200 rounded-md data-[state=active]:text-[#4A4459] py-0 h-[32px] w-[58px] px-4 min-w-[90px] flex justify-between items-center relative"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            All
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#000000] text-white text-xs font-bold rounded-full px-2 py-1">
                {totalCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="text-white text-[20px] border border-[#FFF9F4] hover:bg-gray-200 transition-colors duration-200 rounded-md data-[state=active]:text-[#4A4459] py-0 h-[32px] w-[165px] flex items-center relative"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Comments
            {typeof commentCount !== "undefined" && (
              <span className="absolute -top-2 -right-2 bg-[#000000] text-white text-xs font-bold rounded-full px-2 py-1 z-50">
                {commentCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="boosts"
            className="text-white text-[20px] border border-[#FFF9F4] hover:bg-gray-200 transition-colors duration-200 rounded-md data-[state=active]:text-[#4A4459] py-0 h-[32px] w-[124px] flex items-center relative"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Boosts
            {typeof boostCount !== "undefined" && (
              <span className="absolute -top-2 -right-2 bg-[#000000] text-white text-xs font-bold rounded-full px-2 py-1 z-50">
                {boostCount}
              </span>
            )}
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
                  className={`flex items-start justify-between w-full border rounded-lg gap-[24px] p-[16px_24px] cursor-pointer hover:bg-gray-300 transition ${
                    notif.readStatus ? "bg-gray-200" : "bg-white"
                  }`}
                  style={{
                    borderTop: "1px solid var(--Gray-Gray12, #28363F)",
                    borderRight: "2px solid var(--Gray-Gray12, #28363F)",
                    borderBottom: "2px solid var(--Gray-Gray12, #28363F)",
                    borderLeft: "1px solid var(--Gray-Gray12, #28363F)",
                    background: "var(--neutral-100, #F5F5F5)",
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleNotificationClick(notif);
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

        {/* All Comments */}
        <TabsContent value="comments">
          <section className="flex flex-col gap-2">
            {commentNotifications.length > 0 ? (
              commentNotifications.map((notif) => (
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
                  onClick={(event) => {
                    event.stopPropagation();
                    handleNotificationClick(notif);
                  }}
                >
                  <span class="material-symbols-outlined">account_circle</span>
                  <div className="flex-grow text-center">
                    <h3
                      className="font-bold text-[16px]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {notif.message}
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

        {/* All Boosts */}
        <TabsContent value="boosts">
          <section className="flex flex-col gap-2">
            {boostNotifications.length > 0 ? (
              boostNotifications.map((notif) => (
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
                  onClick={(event) => {
                    event.stopPropagation();
                    handleNotificationClick(notif);
                  }}
                >
                  <span class="material-symbols-outlined">account_circle</span>
                  <div className="flex-grow text-center">
                    <h3
                      className="font-bold text-[16px]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {notif.message}
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
      </Tabs>
    </>
  );
};

export default NotificationTabs;
