import { deleteNotification } from "../../firebase/functions/kebabFunction";
import React, { useEffect, useRef, useState } from "react";

const KebabMenu = ({ onBlock, onMute, onDelete, onPreferences }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="px-2 py-2 flex items-center justify-center" ref={menuRef}>
        {/* Kebab Menu Icon */}
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: "17px", 
            width: "16px",
            height: "17px",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            lineHeight: "1",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          more_vert
        </span>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
            <ul className="py-2 text-gray-700">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={onBlock}
              >
                Block
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={onMute}
              >
                Mute
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={onDelete}
              >
                Delete
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={onPreferences}
              >
                Notification Preferences
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
export default KebabMenu;
