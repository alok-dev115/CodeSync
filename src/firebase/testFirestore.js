import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const testWrite = async () => {
  await addDoc(collection(db, "test"), {
    message: "Firebase connected",
    createdAt: new Date()
  });
};
