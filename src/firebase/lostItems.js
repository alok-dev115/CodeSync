import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getLostItems = async () => {
  const snap = await getDocs(collection(db, "lost_items"));
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
