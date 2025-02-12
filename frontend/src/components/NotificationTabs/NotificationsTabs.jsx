import { db } from "../../firebase/firebase";
import {
  getAllNotifications,
  getUnreadCommentsNotification,
  getUnreadReactionsNotification,
} from "../../firebase/functions/notificationsFunctions";
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

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { notificationList, lastVisible } = await getAllNotifications(
        ownerUserId
      );
      setGetNotifications(notificationList);
      setGetLastVisibleDoc(lastVisible);
      setLoading(false);
    } catch (err) {
      console.error("Error getting initial notifications list: ", err);
      return [];
    }
  };

  // Listener for new notifications
  const listenForNewNotifications = () => {
    try {
      // Reference to a collection
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
        setGetNotifications((prev) => [
          ...newNotifications.filter(
            (newNotification) => !prev.some((p) => p.id === newNotification.id)
          ),
          ...prev,
        ]);
      });

      return unsubscribe;
    } catch (err) {
      console.error("Error listening for new notifications: ", err);
      return [];
    }
  };

  useEffect(() => {
    fetchNotifications();
    const unsubscribe = listenForNewNotifications();
    return () => unsubscribe();
  }, [ownerUserId]);

  const fetchUnreadNotifs = async () => {
    setLoading(true);
    try {
      const [unreadComments, unreadReactions] = await Promise.all([
        getUnreadCommentsNotification(),
        getUnreadReactionsNotification(),
      ]);

      setGetUnreadComments(unreadComments);
      setGetUnreadReactions(unreadReactions);
    } catch (err) {
      console.error("Error fetching notifications list:", err);
    } finally {
      setLoading (false);
    }
  };

  useEffect (() => {
    fetchUnreadNotifs();
  }, [])

  return (
    <>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">ALL</TabsTrigger>
          <TabsTrigger value="comments">COMMENTS</TabsTrigger>
          <TabsTrigger value="reactions">REACTIONS</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ALL Notifications */}
      <TabsContent>
        <section>
          {/* map through the notifications */}
          {getNotifications.map((notif) => (
            <div key={notif.id}>
              <h3>{notif.message}</h3>
              {/* <p>{notif.feedbackId}</p> TODO: get the actual feedback */}
              <p>{notif.createdAt}</p>
            </div>
          ))}
        </section>
      </TabsContent>

      {/* Unread Comments */}
      <TabsContent>
        {getUnreadComments.map((unreadNotif) => (
          <div>
            <h3>{unreadNotif.message}</h3>
            <p>{unreadNotif.createdAt}</p>
          </div>
        ))}
      </TabsContent>

      {/* Unread Reactions */}
      <TabsContent>
      {getUnreadReactions.map((unreadNotif) => (
          <div>
            <h3>{unreadNotif.message}</h3>
            <p>{unreadNotif.createdAt}</p>
          </div>
        ))}
      </TabsContent>
    </>
  );
};

export default NotificationTabs;
