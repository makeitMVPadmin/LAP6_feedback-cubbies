import { useUser } from "../../context/UserContext";
import { getAllNotifications } from "../../firebase/functions/notifications";
import NotificationTabs from "../NotificationTabs/NotificationsTabs";
import { useEffect, useState } from "react";

function NotificationDrawer({ isOpen, onClose }) {
  const { currentUser } = useUser();
  const ownerUserId = currentUser.id;

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40" onClick={onClose}></div>}
      <div
        className={`fixed top-[150px] right-10 bg-transparent p-0 z-50 rounded-tl-lg rounded-bl-lg
          transform transition-transform duration-300 ease-in-out border-none 
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center border-b bg-transparent">
          <NotificationTabs
            ownerUserId={ownerUserId}
          />
        </div>
      </div>
    </>
  );
}

export default NotificationDrawer;
