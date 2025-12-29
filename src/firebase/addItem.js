import { db, auth } from "./firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= LOST ITEM ================= */

export const addLostItem = async (item) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const docRef = await addDoc(collection(db, "lost_items"), {
    ...item,

    // 🔐 Ownership
    userId: auth.currentUser.uid,

    // 🟡 Claim state
    claimed: false,

    // ⏱ Metadata
    createdAt: serverTimestamp(),
  });

  // ✅ Return ID (VERY useful later)
  return docRef.id;
};

/* ================= FOUND ITEM ================= */

export const addFoundItem = async (item) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const docRef = await addDoc(collection(db, "found_items"), {
    ...item,

    // 🔐 Ownership
    userId: auth.currentUser.uid,

    // 🟡 Claim state
    claimed: false,

    // ⏱ Metadata
    createdAt: serverTimestamp(),
  });

  // ✅ Return ID
  return docRef.id;
};
