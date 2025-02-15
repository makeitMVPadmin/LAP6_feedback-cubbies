import NotificationTabs from "../NotificationTabs/NotificationsTabs";
import { X } from "lucide-react";
import { useEffect } from "react";

function NotificationDrawer({ isOpen, onClose }) {
  // Prevent background scrolling when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40" onClick={onClose}></div>}
      <div
        className={`fixed top-[150px] right-0 h-[calc(100vh-104px)] w-[30%] bg-white shadow-lg p-6 z-50 rounded-tl-lg rounded-bl-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <NotificationTabs ownerUserId="g0gWhxIqZCWrGzncO6At" />
        </div>
      </div>
    </>
  );
}

export default NotificationDrawer;
