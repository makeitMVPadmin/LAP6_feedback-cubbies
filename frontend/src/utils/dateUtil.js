import { Timestamp } from "firebase/firestore";

const calculateDaysAgo = (timestamp) => {
  
  const targetDate = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  
  const currentDate = new Date();
  const diffInMilliseconds = currentDate - targetDate;
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInDays === 1) {
    return "1 day ago";
  } else if (diffInDays < 1) {
    return "Today";
  } else {
    return `${diffInDays} days ago`;
  }
};

export { calculateDaysAgo };
