import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

/**
 * 🔔 Create a notification
 */
export const createNotification = async ({ userId, message }) => {
  await addDoc(collection(db, "notifications"), {
    userId,
    message,
    read: false,
    createdAt: serverTimestamp(),
  });
};

/**
 * 🔔 Listen to notifications for a user
 */
export const listenNotifications = (userId, callback) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId)
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};

/**
 * ✅ Mark notification as read
 */
export const markNotificationRead = async (notificationId) => {
  await updateDoc(doc(db, "notifications", notificationId), {
    read: true,
  });
};
