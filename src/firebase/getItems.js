import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const getLostItems = async () => {
  const snap = await getDocs(collection(db, "lost_items"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getFoundItems = async () => {
  const snap = await getDocs(collection(db, "found_items"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
