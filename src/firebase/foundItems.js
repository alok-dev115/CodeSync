import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getFoundItems = async () => {
  const snap = await getDocs(collection(db, "found_items"));
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
