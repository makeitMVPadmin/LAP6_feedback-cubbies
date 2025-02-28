import { useNavigation } from "../../context/NavigationContext";
import { db } from "../../firebase/firebase";
import { deleteNotification } from "../../firebase/functions/kebabFunction";
import useNotifications from "../../firebase/functions/notificationHooks";
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

  // Listens for new notifications
  const { notifications } = useNotifications(ownerUserId);

  // Fetching all initial notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const notifications = await getAllNotifications(ownerUserId);
      // console.log("OwnerUserId: ", ownerUserId);
      // console.log("Fetched ALL notifications: ", notifications);

      // Ensure notifications is an array before updating state
      setGetNotifications(Array.isArray(notifications) ? notifications : []);
    } catch (err) {
      console.error("Error getting initial notifications list: ", err);
    } finally {
      setLoading(false);
    }
  };

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

  // Load initial notifications once on mount
  useEffect(() => {
    fetchNotifications();
  }, [ownerUserId]);

  // Merging when real-time notifications are added
  useEffect(() => {
    if (notifications.length > 0) {
      // console.log("Updated notifications (real-time):", notifications);

      setGetNotifications((prev) => {
        // Merge old and new notifications without duplicates
        const merged = [...notifications, ...prev].filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );
        return merged;
      });
    }
  }, [notifications]);

  // Filtering notifications by comments and boosts
  useEffect(() => {
    setCommentNotif(getNotifications.filter((notif) => notif.feedbackId));
    setBoostNotif(getNotifications.filter((notif) => notif.boostId));
  }, [getNotifications]);

  // Fetch notifications count
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
            {commentNotif.length > 0 ? (
              commentNotif.map((notif) => (
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
            {boostNotif.length > 0 ? (
              boostNotif.map((notif) => (
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
