import {
  listenForNewFeedbacksAndBoosts,
  listenForUnreadNotifications,
} from "./notificationListener";
import { useEffect, useState } from "react";

const useNotifications = (ownerUserId) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerUserId) return;

    // console.log("Initializing notification listeners...");

    // Listen for new feedbacks & boosts (create notifications)
    const unsubscribeFeedbackBoosts =
      listenForNewFeedbacksAndBoosts(ownerUserId);

    // Listen for unread notifications
    const unsubscribeNotifications = listenForUnreadNotifications(
      ownerUserId,
      setNotifications
    );

    setLoading(false);

    return () => {
      unsubscribeFeedbackBoosts();
      unsubscribeNotifications();
    };
  }, [ownerUserId]);

  return { notifications, loading };
};

export default useNotifications;
