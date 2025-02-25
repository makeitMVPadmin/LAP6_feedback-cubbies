import { toast } from "sonner";

export const showCustomToast = () => {
  // Format the date as: "Thursday, January 30, 2025 at 5:57 PM"
  const formattedDate = new Date().toLocaleString("en-US", {
    weekday: "long", // Full weekday name
    year: "numeric", // Full year
    month: "long", // Full month name
    day: "numeric", // Day of the month
  });

  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // Ensures AM/PM format
  });

  toast.custom((t) => (
    <div className="w-[356px] h-[116px] pl-6 pr-8 py-6 bg-white rounded-md shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg border-l border-r-2 border-t border-b-2 border-[#28363f] flex-col justify-start items-start gap-2.5 inline-flex overflow-hidden relative">
      {/* Close Icon (Top-Right) */}
      <button
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-md"
        onClick={() => toast.dismiss(t)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.5">
            <path
              d="M12 4L4 12"
              stroke="#020617"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 4L12 12"
              stroke="#020617"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </button>

      {/* Content Container */}
      <div className="flex flex-col justify-start items-start gap-2">
        {/* Main Message */}
        <div className="text-[#28363f] text-sm font-semibold leading-tight">
          Nice work! Your portfolio piece is now ready for feedback.
        </div>
        {/* Timestamp */}
        <div className="opacity-90 text-[#28363f] text-sm font-normal leading-tight">
          {formattedDate} at {formattedTime}
        </div>
      </div>
    </div>
  ));
};
