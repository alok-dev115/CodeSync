import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const listenLostItems = (callback) => {
  return onSnapshot(collection(db, "lost_items"), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};

export const listenFoundItems = (callback) => {
  return onSnapshot(collection(db, "found_items"), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};
