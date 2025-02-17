import { db } from "../firebase";
import { deleteDoc } from "firebase/firestore";

export const blockUser = async () => {};

export const muteUser = async () => {};

export const deleteNotification = async () => {
  try {
    await deleteDoc(doc(db, "notification", notificationId));
    console.log("Notification deleted successfully");
  } catch (err) {
    console.error("Error deleting notification: ", err);
  }
};
