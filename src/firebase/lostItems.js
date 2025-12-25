// firebase/lostItems.js
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const addLostItem = async (item) => {
  await addDoc(collection(db, "lost_items"), item);
};

export const getLostItems = async () => {
  const snap = await getDocs(collection(db, "lost_items"));
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
