import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const addLostItem = async (item) => {
  await addDoc(collection(db, "lost_items"), {
    ...item,
    createdAt: serverTimestamp(),
  });
};

export const addFoundItem = async (item) => {
  await addDoc(collection(db, "found_items"), {
    ...item,
    createdAt: serverTimestamp(),
  });
};
