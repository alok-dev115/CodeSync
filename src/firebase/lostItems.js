import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { auth } from "./firebaseConfig";

// 🔐 Add lost item (only logged-in user)
export const addLostItem = async (item) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  await addDoc(collection(db, "lost_items"), {
    ...item,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });
};

// 🔍 Get only current user's lost items
export const getLostItems = async () => {
  if (!auth.currentUser) return [];

  const q = query(
    collection(db, "lost_items"),
    where("userId", "==", auth.currentUser.uid)
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
