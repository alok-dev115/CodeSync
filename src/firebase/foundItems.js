import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const addFoundItem = async (item) => {
  // 🔥 Store Firestore Timestamp AS-IS
  await addDoc(collection(db, "found_items"), item);
};

export const getFoundItems = async () => {
  const snap = await getDocs(collection(db, "found_items"));
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
