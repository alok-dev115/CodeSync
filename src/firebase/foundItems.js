// import { collection, addDoc, getDocs } from "firebase/firestore";
// import { db } from "./firebaseConfig";

// export const addFoundItem = async (item) => {
//   // 🔥 Store Firestore Timestamp AS-IS
//   await addDoc(collection(db, "found_items"), item);
// };

// export const getFoundItems = async () => {
//   const snap = await getDocs(collection(db, "found_items"));
//   return snap.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// };
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

// 🔐 Add found item (only logged-in user)
export const addFoundItem = async (item) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  await addDoc(collection(db, "found_items"), {
    ...item,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
  });
};

// 🔍 Get only current user's found items
export const getFoundItems = async () => {
  if (!auth.currentUser) return [];

  const q = query(
    collection(db, "found_items"),
    where("userId", "==", auth.currentUser.uid)
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
