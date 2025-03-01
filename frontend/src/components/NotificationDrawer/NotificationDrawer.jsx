import { useUser } from "../../context/UserContext";
import NotificationTabs from "../NotificationTabs/NotificationsTabs";
import { useEffect } from "react";

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
        className={`fixed right-0 transform bg-[#bfdbfe] p-0 z-50 rounded-lg
        transition-transform duration-300 ease-in-out border-none 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          width: "627px",
          maxHeight: "700px",
          height: "700px",
          top: "53%",
          right: isOpen ? "22%" : "0",
          transform: "translateY(-50%)",
          overflowY: "scroll",
          overflowX: "hidden",
          scrollbarWidth: "none",
        }}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center border-b bg-transparent">
          <NotificationTabs ownerUserId={ownerUserId} />
        </div>
      </div>
    </>
  );
}

export default NotificationDrawer;
