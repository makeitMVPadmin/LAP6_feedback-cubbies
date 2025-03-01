import { useNavigation } from "../../context/NavigationContext";
import { deleteNotification } from "../../firebase/functions/kebabFunction";
import useNotifications from "../../firebase/functions/notificationHooks";
import {
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
import React, { useEffect, useState } from "react";

const NotificationTabs = ({ ownerUserId }) => {
  const [getNotifications, setGetNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [boostCount, setBoostCount] = useState(0);
  const [notifClick, setNotifClick] = useState(getNotifications);
  const { goToProfileDetails, setNotificationCount } = useNavigation();
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
      setNotificationCount((prev) => (prev !== totalCount ? totalCount : prev));
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
        const uniqueNotifications = new Map();
        [...notifications, ...prev].forEach((notif) =>
          uniqueNotifications.set(notif.id, notif)
        );
        return Array.from(uniqueNotifications.values());
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

  //className=" ">

  return (
    <>
      <Tabs defaultValue="all">
        <TabsList className="relative bg-transparent flex justify-start rounded-none w-full  min-w-[621px] min-h-[40px] gap-[24px] mt-[11px] mb-[12px] p-[12px_16px]">
          <TabsTrigger
            value="all"
            className="h-8 min-w-[50px] px-3 py-1.5 text-base font-semibold leading-tight rounded flex justify-between items-center whitespace-nowrap relative transition-colors 
            bg-[#4386f5] text-white border border-transparent 
            data-[state=active]:bg-white data-[state=active]:border-l data-[state=active]:border-r-2 data-[state=active]:border-t data-[state=active]:border-b-2 data-[state=active]:border-[#0099ff] data-[state=active]:text-[#0099ff]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            All
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#000000] text-white text-xs font-bold rounded-full px-2 py-1 min-w-[24px]">
                {totalCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="h-8 min-w-[131px] px-3 py-1.5 text-base font-semibold leading-tight rounded flex justify-between items-center whitespace-nowrap relative transition-colors 
            bg-[#4386f5] text-white border border-transparent 
            data-[state=active]:bg-white data-[state=active]:border-l data-[state=active]:border-r-2 data-[state=active]:border-t data-[state=active]:border-b-2 data-[state=active]:border-[#0099ff] data-[state=active]:text-[#0099ff]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Comments
            {typeof commentCount !== "undefined" && (
              <span className="absolute -top-2 -right-2 bg-[#000000] text-white text-xs font-bold rounded-full px-2 py-1 z-50 min-w-[24px]">
                {commentCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="boosts"
            className="h-8 min-w-[81px] px-3 py-1.5 text-base font-semibold leading-tight rounded flex justify-between items-center whitespace-nowrap relative transition-colors 
            bg-[#4386f5] text-white border border-transparent 
            data-[state=active]:bg-white data-[state=active]:border-l data-[state=active]:border-r-2 data-[state=active]:border-t data-[state=active]:border-b-2 data-[state=active]:border-[#0099ff] data-[state=active]:text-[#0099ff]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Boosts
            {typeof boostCount !== "undefined" && (
              <span className="absolute -top-2 -right-2 bg-[#000000] text-white text-xs font-bold rounded-full px-2 py-1 z-50 min-w-[24px]">
                {boostCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ALL Notifications */}
        <TabsContent value="all" className="rounded-lg overflow-hidden">
          <section className="flex flex-col gap-2">
            {/* map through the notifications */}
            {getNotifications.length > 0 ? (
              getNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`h-[104px] w-full bg-neutral-100 rounded-bl-lg rounded-br-lg gap-6 px-6 py-4 p-4 border-l border-r-2 border-t border-b-2 border-[#28363f] flex items-start justify-start inline-flex cursor-pointer hover:bg-gray-300 transition ${
                    notif.readStatus ? "bg-gray-200" : "bg-white"
                  }`}
                  style={{
                    borderRadius: "12px",
                    borderWidth: "1px 2px 2px 1px",
                    borderColor: "#28363F",
                    background: "#F5F5F5",
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleNotificationClick(notif);
                  }}
                >
                  {/* Profile Picture */}
                  <span
                    class="material-symbols-outlined"
                    style={{
                      fontSize: "34px",
                      width: "32px",
                      height: "34px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48", // Ensures correct scaling
                    }}
                  >
                    account_circle
                  </span>
                  {/* Notification Content */}
                  <div className="flex-1 min-w-[300px] max-w-[500px] flex flex-col justify-start gap-[4px]">
                    <h3
                      className="text-[#182127] text-base font-bold leading-tight"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {notif.message}
                    </h3>
                    <p
                      className="text-black text-sm font-normal leading-tight w-full"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {notif.feedbackContent}
                    </p>
                    <p className="text-slate-950 text-base text-right font-normal font-['Inter'] leading-normal">
                      {notif.createdAt
                        ? new Date(notif.createdAt.toDate()).toLocaleDateString(
                            "en-US",
                            {
                              year: "2-digit",
                              month: "numeric",
                              day: "numeric",
                            }
                          )
                        : ""}
                    </p>
                  </div>
                  {/* Kebab Menu */}
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
                className="h-[104px] w-full bg-neutral-100 rounded-bl-lg rounded-br-lg gap-6 px-6 py-4 p-4 border-l border-r-2 border-t border-b-2 border-[#28363f] flex items-start justify-start inline-flex cursor-pointer hover:bg-gray-300 transition"
                style={{
                  borderRadius: "12px",
                  borderWidth: "1px 2px 2px 1px",
                  borderColor: "#28363F",
                  background: "#F5F5F5",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                No notifications to display.
              </p>
            )}
          </section>
        </TabsContent>

        {/* All Comments */}
        <TabsContent value="comments" className="rounded-lg overflow-hidden">
          <section className="flex flex-col gap-2">
            {commentNotif.length > 0 ? (
              commentNotif.map((notif) => (
                <div
                  key={notif.id}
                  className={`h-[104px] w-full bg-neutral-100 rounded-bl-lg rounded-br-lg gap-6 px-6 py-4 p-4 border-l border-r-2 border-t border-b-2 border-[#28363f] flex items-start justify-start inline-flex cursor-pointer hover:bg-gray-300 transition ${
                    notif.readStatus ? "bg-gray-200" : "bg-white"
                  }`}
                  style={{
                    borderRadius: "12px",
                    borderWidth: "1px 2px 2px 1px",
                    borderColor: "#28363F",
                    background: "#F5F5F5",
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleNotificationClick(notif);
                  }}
                >
                  {/* Profile Picture */}
                  <span
                    class="material-symbols-outlined"
                    style={{
                      fontSize: "34px",
                      width: "32px",
                      height: "34px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48", // Ensures correct scaling
                    }}
                  >
                    account_circle
                  </span>
                  {/* Notification Content */}
                  <div className="flex-1 min-w-[300px] max-w-[500px] flex flex-col justify-start gap-[4px]">
                    <h3
                      className="text-[#182127] text-base font-bold leading-tight"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {notif.message}
                    </h3>
                    <p
                      className="text-black text-sm font-normal leading-tight"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {notif.feedbackContent}
                    </p>
                    <p className="text-slate-950 text-base text-right font-normal font-['Inter'] leading-normal">
                      {notif.createdAt
                        ? new Date(notif.createdAt.toDate()).toLocaleDateString(
                            "en-US",
                            {
                              year: "2-digit",
                              month: "numeric",
                              day: "numeric",
                            }
                          )
                        : ""}
                    </p>
                  </div>
                  {/* Kebab Menu */}
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
                className="h-[104px] w-full bg-neutral-100 rounded-bl-lg rounded-br-lg gap-6 px-6 py-4 p-4 border-l border-r-2 border-t border-b-2 border-[#28363f] flex items-start justify-start inline-flex cursor-pointer hover:bg-gray-300 transition"
                style={{
                  borderRadius: "12px",
                  borderWidth: "1px 2px 2px 1px",
                  borderColor: "#28363F",
                  background: "#F5F5F5",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                No notifications to display.
              </p>
            )}
          </section>
        </TabsContent>

        {/* All Boosts */}
        <TabsContent value="boosts" className="rounded-lg overflow-hidden">
          <section className="flex flex-col gap-2">
            {boostNotif.length > 0 ? (
              boostNotif.map((notif) => (
                <div
                  key={notif.id}
                  className={`h-[104px] w-full bg-neutral-100 rounded-bl-lg rounded-br-lg gap-6 px-6 py-4 p-4 border-l border-r-2 border-t border-b-2 border-[#28363f] flex items-start justify-start inline-flex cursor-pointer hover:bg-gray-300 transition ${
                    notif.readStatus ? "bg-gray-200" : "bg-white"
                  }`}
                  style={{
                    borderRadius: "12px",
                    borderWidth: "1px 2px 2px 1px",
                    borderColor: "#28363F",
                    background: "#F5F5F5",
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleNotificationClick(notif);
                  }}
                >
                  {/* Profile Picture */}
                  <span
                    class="material-symbols-outlined"
                    style={{
                      fontSize: "34px",
                      width: "32px",
                      height: "34px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48", // Ensures correct scaling
                    }}
                  >
                    account_circle
                  </span>
                  {/* Notification Content */}
                  <div className="flex-1 min-w-[300px] max-w-[500px] flex flex-col justify-start gap-[4px]">
                    <h3
                      className="text-[#182127] text-base font-bold leading-tight"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {notif.message}
                    </h3>
                    {/* Placeholder for styling*/}
                    <p
                      className="text-transparent text-sm font-normal leading-tight"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Placeholder
                    </p>
                    <p className="text-slate-950 text-base text-right font-normal font-['Inter'] leading-normal">
                      {notif.createdAt
                        ? new Date(notif.createdAt.toDate()).toLocaleDateString(
                            "en-US",
                            {
                              year: "2-digit",
                              month: "numeric",
                              day: "numeric",
                            }
                          )
                        : ""}
                    </p>
                  </div>
                  {/* Kebab Menu */}
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
                className="h-[104px] w-full bg-neutral-100 rounded-bl-lg rounded-br-lg gap-6 px-6 py-4 p-4 border-l border-r-2 border-t border-b-2 border-[#28363f] flex items-start justify-start inline-flex cursor-pointer hover:bg-gray-300 transition"
                style={{
                  borderRadius: "12px",
                  borderWidth: "1px 2px 2px 1px",
                  borderColor: "#28363F",
                  background: "#F5F5F5",
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
