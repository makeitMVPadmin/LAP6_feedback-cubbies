import { db } from "../firebase";
import { deleteDoc } from "firebase/firestore";

export const blockUser = async () => {};

export const muteUser = async () => {};

export const deleteNotification = async (notificationId) => {
  try {
    await deleteDoc(doc(db, "notifications", notificationId));
    console.log(`Notification ${notificationId} deleted successfully`);
  } catch (err) {
    console.error("Error deleting notification: ", err);
  }
};
